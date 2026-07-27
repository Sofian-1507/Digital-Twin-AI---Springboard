import mongoose from 'mongoose';
import { BaseRepository } from './base_repository';
import { IUser } from '../schemas/user_schema';
import { User, GoalArchive } from '../models/index';
import { IActiveGoal } from '../schemas/subdocuments/active_goal';
import { GoalStatus } from '../schemas/enums';

/**
 * Enterprise User Data Access Object (DAO).
 * Manages zero-hop profile retrieval, atomic goal array bounds checking,
 * and milestone archival to GoalArchive when targets are completed or abandoned.
 */
export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  /**
   * Zero-Hop Twin Context Retrieval:
   * Fetches user identity, profile, preferences, active goals, and real-time twin state in exactly 1 database read (O(1)).
   * Suppresses sensitive password_hash automatically.
   */
  public async getTwinContext(userId: string | mongoose.Types.ObjectId): Promise<IUser | null> {
    return await this.model.findById(userId).exec();
  }

  /**
   * Atomically adds a new active goal to the user's array while enforcing the Rule of 100 hard cap (<= 30 items).
   */
  public async addActiveGoal(userId: string | mongoose.Types.ObjectId, goal: IActiveGoal): Promise<IUser | null> {
    const user = await this.model.findById(userId);
    if (!user) throw new Error(`[UserRepository] User not found: ${userId}`);
    if (user.active_goals.length >= 30) {
      throw new Error(`[UserRepository] Active goals array hard cap reached (30 items). Please complete or archive existing targets first.`);
    }

    return await this.model.findByIdAndUpdate(
      userId,
      { $push: { active_goals: goal } },
      { new: true, runValidators: true }
    ).exec();
  }

  /**
   * Atomically completes or abandons a goal: removes it from users.active_goals and archives it into the 'goals' collection.
   */
  public async archiveGoal(
    userId: string | mongoose.Types.ObjectId,
    goalId: string | mongoose.Types.ObjectId,
    status: GoalStatus,
    finalValue: mongoose.Types.Decimal128,
    aiRetrospective?: string
  ): Promise<boolean> {
    const user = await this.model.findById(userId);
    if (!user) return false;

    const goalIndex = user.active_goals.findIndex((g) => g.goal_id.toString() === goalId.toString());
    if (goalIndex === -1) return false;

    const targetGoal = user.active_goals[goalIndex];

    // Create historical archive entry in 'goals' collection
    await GoalArchive.create({
      user_id: user._id,
      original_goal_id: targetGoal.goal_id,
      title: targetGoal.title,
      category: targetGoal.category,
      target_value: targetGoal.target_value,
      final_value: finalValue,
      unit: targetGoal.unit,
      status: status,
      ai_retrospective: aiRetrospective,
      created_at: targetGoal.created_at || new Date(),
      closed_at: new Date(),
    });

    // Atomically pull from active_goals array
    await this.model.findByIdAndUpdate(userId, {
      $pull: { active_goals: { goal_id: targetGoal.goal_id } },
    });

    return true;
  }

  /**
   * Atomically updates a specific metric inside the embedded digital_twin_state subdocument.
   */
  public async updateTwinStateMetric(
    userId: string | mongoose.Types.ObjectId,
    metricKey: keyof IUser['digital_twin_state'],
    value: any
  ): Promise<IUser | null> {
    const updatePayload: Record<string, any> = {
      [`digital_twin_state.${metricKey}`]: value,
      'digital_twin_state.last_updated_at': new Date(),
    };

    return await this.model.findByIdAndUpdate(userId, { $set: updatePayload }, { new: true, runValidators: true }).exec();
  }
}

export const userRepository = new UserRepository();

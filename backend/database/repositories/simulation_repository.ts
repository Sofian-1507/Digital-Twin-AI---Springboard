import mongoose from 'mongoose';
import { BaseRepository } from './base_repository';
import { ISimulation } from '../schemas/simulation_schema';
import { Simulation } from '../models/index';
import { SimulationDomain } from '../schemas/enums';

/**
 * Enterprise Simulation Data Access Object (DAO).
 * Manages retrieval of immutable What-If scenario perturbations and comparative deltas.
 */
export class SimulationRepository extends BaseRepository<ISimulation> {
  constructor() {
    super(Simulation);
  }

  /**
   * Retrieves user simulation history filtered by domain, sorted by most recent execution first.
   */
  public async getSimulationHistory(
    userId: string | mongoose.Types.ObjectId,
    domain?: SimulationDomain,
    limit: number = 10
  ): Promise<ISimulation[]> {
    const uId = new mongoose.Types.ObjectId(userId.toString());
    const filter: Record<string, any> = { user_id: uId };
    if (domain) filter['domain'] = domain;

    return await this.model.find(filter).sort({ generated_at: -1 }).limit(limit).exec();
  }
}

export const simulationRepository = new SimulationRepository();

import mongoose, { Model } from 'mongoose';
import { ISimulation, SimulationSchema } from '../schemas/simulation_schema';

/**
 * Mongoose ODM Model for the 'simulations' collection.
 * Immutable archive of user What-If scenario analyses and mathematical perturbations.
 */
export const Simulation: Model<ISimulation> =
  mongoose.models.Simulation || mongoose.model<ISimulation>('Simulation', SimulationSchema, 'simulations');

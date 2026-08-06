"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulationRepository = exports.SimulationRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const base_repository_1 = require("./base_repository");
const index_1 = require("../models/index");
/**
 * Enterprise Simulation Data Access Object (DAO).
 * Manages retrieval of immutable What-If scenario perturbations and comparative deltas.
 */
class SimulationRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(index_1.Simulation);
    }
    /**
     * Retrieves user simulation history filtered by domain, sorted by most recent execution first.
     */
    async getSimulationHistory(userId, domain, limit = 10) {
        const uId = new mongoose_1.default.Types.ObjectId(userId.toString());
        const filter = { user_id: uId };
        if (domain)
            filter['domain'] = domain;
        return await this.model.find(filter).sort({ generated_at: -1 }).limit(limit).exec();
    }
}
exports.SimulationRepository = SimulationRepository;
exports.simulationRepository = new SimulationRepository();

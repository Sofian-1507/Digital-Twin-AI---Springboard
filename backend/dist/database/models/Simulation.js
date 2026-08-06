"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simulation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const simulation_schema_1 = require("../schemas/simulation_schema");
/**
 * Mongoose ODM Model for the 'simulations' collection.
 * Immutable archive of user What-If scenario analyses and mathematical perturbations.
 */
exports.Simulation = mongoose_1.default.models.Simulation || mongoose_1.default.model('Simulation', simulation_schema_1.SimulationSchema, 'simulations');

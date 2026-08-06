"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
/**
 * Generic Base Repository Pattern Abstract Class.
 * Encapsulates standard CRUD operations, pagination, and atomic updates,
 * insulating higher-level domain logic from Mongoose ODM specifics.
 */
class BaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        const created = new this.model(data);
        return await created.save();
    }
    async createMany(data) {
        return (await this.model.insertMany(data));
    }
    async findById(id, projection, options) {
        return await this.model.findById(id, projection, options).exec();
    }
    async findOne(filter, projection, options) {
        return await this.model.findOne(filter, projection, options).exec();
    }
    async find(filter = {}, projection, options) {
        return await this.model.find(filter, projection, options).exec();
    }
    async paginate(filter = {}, page = 1, limit = 20, sort = { _id: -1 }, projection) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.model.find(filter, projection).sort(sort).skip(skip).limit(limit).exec(),
            this.model.countDocuments(filter).exec(),
        ]);
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
        };
    }
    async updateById(id, update, options = { new: true }) {
        return await this.model.findByIdAndUpdate(id, update, options).exec();
    }
    async deleteById(id) {
        const result = await this.model.findByIdAndDelete(id).exec();
        return result !== null;
    }
    async count(filter = {}) {
        return await this.model.countDocuments(filter).exec();
    }
}
exports.BaseRepository = BaseRepository;

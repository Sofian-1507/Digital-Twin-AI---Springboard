import mongoose, { Model, Document, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Generic Base Repository Pattern Abstract Class.
 * Encapsulates standard CRUD operations, pagination, and atomic updates,
 * insulating higher-level domain logic from Mongoose ODM specifics.
 */
export abstract class BaseRepository<T extends Document> {
  protected constructor(protected readonly model: Model<T>) {}

  public async create(data: Partial<T>): Promise<T> {
    const created = new this.model(data);
    return await created.save();
  }

  public async createMany(data: Partial<T>[]): Promise<T[]> {
    return (await this.model.insertMany(data)) as unknown as T[];
  }

  public async findById(id: string | mongoose.Types.ObjectId, projection?: any, options?: QueryOptions): Promise<T | null> {
    return await this.model.findById(id, projection, options).exec();
  }

  public async findOne(filter: FilterQuery<T>, projection?: any, options?: QueryOptions): Promise<T | null> {
    return await this.model.findOne(filter, projection, options).exec();
  }

  public async find(filter: FilterQuery<T> = {}, projection?: any, options?: QueryOptions): Promise<T[]> {
    return await this.model.find(filter, projection, options).exec();
  }

  public async paginate(
    filter: FilterQuery<T> = {},
    page: number = 1,
    limit: number = 20,
    sort: any = { _id: -1 },
    projection?: any
  ): Promise<PaginatedResult<T>> {
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

  public async updateById(id: string | mongoose.Types.ObjectId, update: UpdateQuery<T>, options: QueryOptions = { new: true }): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, update, options).exec();
  }

  public async deleteById(id: string | mongoose.Types.ObjectId): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return result !== null;
  }

  public async count(filter: FilterQuery<T> = {}): Promise<number> {
    return await this.model.countDocuments(filter).exec();
  }
}

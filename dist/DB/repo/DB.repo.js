"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBRepo = void 0;
class DBRepo {
    model;
    constructor(model) {
        this.model = model;
    }
    async findById(id, projection, options) {
        const doc = await this.model.findById(id, projection, options);
        return doc;
    }
    async find(filter, projection, options) {
        const docs = await this.model.find(filter, projection, options);
        return docs;
    }
    async findOne(filter, projection, options) {
        const doc = await this.model.findOne(filter, projection, options);
        return doc;
    }
    async create(data) {
        return this.model.create(data);
    }
    async createMany(data) {
        return this.model.create(data);
    }
    async updateOne(filter, update, options) {
        const result = await this.model.updateOne(filter, update, options);
        return result;
    }
    async updateMany(filter, update, options) {
        const result = await this.model.updateMany(filter, update, options);
        return result;
    }
    async findOneAndUpdate(filter, update, options) {
        const docs = await this.model.findOneAndUpdate(filter, update, options);
        return docs;
    }
    async findByIdAndUpdate(id, update, options) {
        const docs = await this.model.findByIdAndUpdate(id, update, options);
        return docs;
    }
    async deleteOne(filter, options) {
        const result = await this.model.deleteOne(filter, options);
        return result;
    }
    async deleteMany(filter, options) {
        const result = await this.model.deleteMany(filter, options);
        return result;
    }
    async findOneAndDelete(filter, options) {
        const docs = await this.model.findOneAndDelete(filter, options);
        return docs;
    }
    async findByIdAndDelete(id, options) {
        const docs = await this.model.findByIdAndDelete(id, options);
        return docs;
    }
}
exports.DBRepo = DBRepo;

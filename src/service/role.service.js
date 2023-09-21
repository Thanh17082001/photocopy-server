import roleModel from '../model/role.model'

class roleSerVice{
    async create(data){
        return await roleModel.create(data)
    }

    async find(condition={}, pageNumber={}, pageSize={}, sort={createdAt:-1}){
        const skip = !!pageNumber && !!pageSize ? (pageNumber - 1) * pageSize : {};
        return await roleModel.find(condition).sort(sort).skip(skip).limit(pageSize).lean();
    }

    async update(id, data){
        return await roleModel.findByIdAndUpdate(id, data, {returnDocument:'after', upsert:true})
    }

    async findById(id){
        return await roleModel.findById(id)
    }
}

export default new roleSerVice()
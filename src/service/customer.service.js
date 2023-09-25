import customerModel from '../model/customer.model'

class customerSerVice{
    async create(data){
        return await customerModel.create(data)
    }

    async find(condition={}, pageNumber={}, pageSize={}, sort={createdAt:-1}){
        const skip = !!pageNumber && !!pageSize ? (pageNumber - 1) * pageSize : {};
        return await customerModel.find(condition).sort(sort).skip(skip).limit(pageSize).lean();
    }

    async update(id, data){
        return await customerModel.findByIdAndUpdate(id, data, {returnDocument:'after', upsert:true})
    }

    async findById(id){
        return await customerModel.findById(id)
    }
}

export default new customerSerVice()
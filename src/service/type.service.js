import typeModel from '../model/type.model';

class typeService{
    async create (data){
        return await typeModel.create(data)
    }
    async findAll(){
        return await typeModel.find({})
    }
    async findByName(name){
        return await typeModel.findOne({name})
    }
    async findById(id){
        return await typeModel.findById(id)
    }
    async checkNameExist(id, name){
        return typeModel.findOne({name, _id:{$ne:id}})

    }
    async update(id, data){
        return await typeModel.findByIdAndUpdate(id,{$set: data}, {
            returnDocument:'after'
        })
    }
    async deleteById(id){
        return await typeModel.findByIdAndDelete(id)
    }
}

export default new typeService();
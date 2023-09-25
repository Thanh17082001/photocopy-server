import typeAccModel from '../model/typeAccessory.model';

class typeAccService{
    async create (data){
        return await typeAccModel.create(data)
    }
    async findAll(){
        return await typeAccModel.find({})
    }
    async findByName(name){
        return await typeAccModel.findOne({name})
    }
    async findById(id){
        return await typeAccModel.findById(id)
    }
    async checkNameExist(id, name){
        return typeAccModel.findOne({name, _id:{$ne:id}})

    }
    async update(id, data){
        return await typeAccModel.findByIdAndUpdate(id,{$set: data}, {
            returnDocument:'after'
        })
    }
    async deleteById(id){
        return await typeAccModel.findByIdAndDelete(id)
    }
}

export default new typeAccService();
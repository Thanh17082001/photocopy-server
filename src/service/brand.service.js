import brandModel from '../model/brand.model';

class brandService{
    async create (data){
        return await brandModel.create(data)
    }
    async findAll(){
        return await brandModel.find({})
    }
    async findByName(name){
        return await brandModel.findOne({name})
    }
    async findById(id){
        return await brandModel.findById(id)
    }
    async checkNameExist(id, name){
        return brandModel.findOne({name, _id:{$ne:id}})

    }
    async update(id, data){
        return await brandModel.findByIdAndUpdate(id,{$set: data}, {
            returnDocument:'after'
        })
    }
    async deleteById(id){
        return await brandModel.findByIdAndDelete(id)
    }
}

export default new brandService();
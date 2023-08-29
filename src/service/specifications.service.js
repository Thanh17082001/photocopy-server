import specificationsModel from "../model/specifications.model";


class specificationsService{
    async create(data){
        return await specificationsModel.create(data)
    }
    
    async findByIdProduct(idProduct){
        return await specificationsModel.findOne({idProduct}).lean()
    }

    async updateById(id, data){
        return await specificationsModel.findByIdAndUpdate(id,{$set: data}, {
            returnDocument:'after'
        })
    }
}

export default new specificationsService()
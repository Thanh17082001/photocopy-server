import companyModel from "../model/company.model";

class companyService{

    async create(data){
        return await companyModel.create(data)
    }

    async find(){
        return await companyModel.find({}).lean()
    }

    async updateById(id, data){
        return await companyModel.findByIdAndUpdate(id, data, {returnDocument:'after', upsert:true})
    }
    async findById(id){
        return await companyModel.findById(id)
    }

}

export default new companyService()
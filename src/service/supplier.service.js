import supplierModel from "../model/supplier.model";

class supplierService{
    async create(data){
        return supplierModel.create(data)
    }
    async find(){
        return supplierModel.find()
    }
    
}

export default new supplierService()
import entryReceiptModel from "../model/entryReceipt.model";

class entryReceiptService{
    async create(data){
        return await entryReceiptModel.create(data)
    }

    async findEntry(condition, pageNumber, pageSize, sort){
        const skip= (pageNumber-1)*pageSize
        return await entryReceiptModel
            .find(condition)
            .limit(pageSize)
            .skip(skip)
            .populate('products.idProduct')
            .populate('createBy')
            .sort(sort)
            .lean()
    }
    async findById(id){
        return await entryReceiptModel.findById(id).populate('products.idProduct', 'name').populate('createBy').lean()
    }
}

export default new entryReceiptService()
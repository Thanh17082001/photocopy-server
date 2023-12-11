import accessoryModel from "../model/accessory.model";

class accessoryService{
    async create(data){
        return await accessoryModel.create(data)
    }

    async find(condition={},pageNumber={}, pageSize={}, sort={createdAt:-1}){
        const skip = (pageNumber - 1) * pageSize;
        return accessoryModel.find(condition).sort(sort).limit(pageSize).skip(skip).lean()
    }

    async  finById(id){
        return await accessoryModel
            .findById(id)
            .populate('fits.product')
            .populate('brandId')
            .populate('typeId')
            .lean()
    }

    async findByDate(day, month, year, field, pageNumber, pageSize) {
        // co phan trang
        const condition = {
            $expr: {
                $and: [],
            },
        };
        if (day != 0) {
            condition.$expr.$and.push({ $eq: [{ $dayOfMonth: '$' + field }, day] });
        }
        if (month != 0) {
            condition.$expr.$and.push({ $eq: [{ $month: '$' + field }, month] });
        }
        if (year != 0) {
            condition.$expr.$and.push({ $eq: [{ $year: '$' + field }, year] });
        }
        if (!!pageNumber && !!pageSize) {
            const skip = (pageNumber - 1) * pageSize;
            const result = await accessoryModel.find(condition).sort({ createdAt: -1 }).skip(skip).limit(pageSize).lean();
            return result;
        }
        // khong phan trang && khong dung de find private key
        else {
            return await accessoryModel.find(condition).sort({ createdAt: -1 });
        }
    }
    async update(id, data){
        return await accessoryModel.findByIdAndUpdate(id, data, {returnDocument:'after', upsert:true}) 
    }
    async updateAfterEntry(id, data) {
        return await accessoryModel
            .findByIdAndUpdate(
                id,
                {
                    $inc: { inputQuantity: data.inputQuantity },
                    $set: { priceImport: data.priceImport },
                    dateEntyReceipt:data.dateEntyReceipt
                },
                { returnDocument: 'after', upsert: true },
            )
            .lean();
    }

    async updateAfterCancelOrder(id, data) {
        return accessoryModel
            .findByIdAndUpdate(
                id,
                {
                    $inc: { 
                        inputQuantity: data.quantity,
                        soldQuantity:-data.quantity
                     },
                },
                { returnDocument: 'after' },
            )
            .lean();
    }


    async updateAfterOrder(id,data){
       return await accessoryModel.findByIdAndUpdate(
            id,
            {
                $inc:{inputQuantity:-data.quantity, soldQuantity:data.quantity},
            },
            {returnDocument:'after',upsert:true}
        )
    }
}

export default new accessoryService()
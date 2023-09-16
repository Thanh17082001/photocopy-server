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
            .populate('products.idProduct', ['name'])
            .populate('createBy',['fullName','phoneNumber'])
            .populate('supplier')
            .sort(sort)
            .lean()
    }
    async findById(id){
        return await entryReceiptModel
            .findById(id)
            .populate('products.idProduct', ['name'])
            .populate('createBy',['fullName','phoneNumber'])
            .populate('supplier')
            .lean();
    }

     // loc theo ngay thang nam
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
            const result = await entryReceiptModel
                .find(condition).sort({ createdAt: -1 })
                .populate('products.idProduct', ['name'])
                .populate('createBy',['fullName','phoneNumber'])
                .populate('supplier')
                .skip(skip)
                .limit(pageSize)
                .lean();
            return result;
        }
        // khong phan trang && khong dung de find private key
        else {
            return await entryReceiptModel.find(condition).sort({ createdAt: -1 });
        }
    }
}

export default new entryReceiptService()
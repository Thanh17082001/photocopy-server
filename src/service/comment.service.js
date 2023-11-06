import commentModel from "../model/comment.model";


class commentService{
    async create(data){
        return await commentModel.create(data)
    }
    async find(condition={}, pageNumber={}, pageSize={}, sort={createdAt:-1}){
        const skip = !!pageNumber && !!pageSize ? (pageNumber - 1) * pageSize : {};
        return await commentModel
            .find(condition)
            .populate('productId')
            .sort(sort)
            .skip(skip)
            .limit(pageSize)
            .lean();
    }
    async findByIdProduct(condition={}, pageNumber={}, pageSize={}, sort={createdAt:-1}){
        const skip = !!pageNumber && !!pageSize ? (pageNumber - 1) * pageSize : {};
        return await commentModel
            .find(condition)
            .sort(sort)
            .skip(skip)
            .limit(pageSize)
            .lean();
    }
    async findById(id){
        return await commentModel
        .findById(id)
        .populate('productId')
        .lean()
    }
    async updateById(id, data){
        return await commentModel.findByIdAndUpdate(id,{$set: data}, {
            returnDocument:'after'
        })
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
            condition.$expr.$and.push({ $eq: [{ $dayOfMonth: '$' + field },day] });
        }
        if (month != 0) {
            condition.$expr.$and.push({ $eq: [{ $month: '$' + field }, month] });
        }
        if (year != 0) {
            condition.$expr.$and.push({ $eq: [{ $year: '$' + field }, year] });
        }
        if (!!pageNumber && !!pageSize) {
            const skip = (pageNumber - 1) * pageSize;
            const result = await commentModel.find(condition).sort({ createdAt: -1 }).skip(skip).limit(pageSize).populate('productId').lean()
            return result;
        }
        // khong phan trang && khong dung de find private key
        else {
            return await commentModel.find(condition).sort({ createdAt: -1 });
        }
    }
}

export default new commentService()
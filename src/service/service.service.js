import serviceModel from '../model/service.model'

class serviceService{
    async create(data){
        return await serviceModel.create(data)
    }

    async find(condition={}, pageNumber={}, pageSize={}, sort={createdAt:-1}){
        const skip = !!pageNumber && !!pageSize ? (pageNumber - 1) * pageSize : {};
        return await serviceModel
            .find(condition)
            .sort(sort)
            .skip(skip)
            .limit(pageSize)
            .lean();
    }

    async update(id, data){
        return await serviceModel.findByIdAndUpdate(id, data, {returnDocument:'after', upsert:true})
    }

    async findById(id){
        return await serviceModel
        .findById(id)
        .lean()
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
            const result = await serviceModel.find(condition).sort({ createdAt: -1 }).skip(skip).limit(pageSize).lean()
            return result;
        }
        // khong phan trang && khong dung de find private key
        else {
            return await serviceModel.find(condition).sort({ createdAt: -1 });
        }
    }
    async delete(id){
        return serviceModel.findByIdAndDelete(id)
    }
}

export default new serviceService()
import staffModel from "../model/staff.model";

class staffService{
    async create(data){
        return await staffModel.create(data)
    }

    async checkExit(condition){
        return staffModel.findOne(condition).lean()
    }

    async find(condition={}, pageNumber={}, pageSize={}, sort={}){
        const skip = !!pageNumber && !!pageSize ? (pageNumber - 1) * pageSize : {};
        return await staffModel
                        .find(condition)
                        .sort(sort)
                        .skip(skip)
                        .limit(pageSize)
                        .lean();
    }

    async update(id, data){
        return await staffModel.findByIdAndUpdate(id, data, {returnDocument:'after', upsert:true})
    }

    async findById(id){
        return await staffModel.findById(id).populate('idUser','avatar').lean();
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
            const result = await staffModel.find(condition).sort({ createdAt: -1 }).skip(skip).limit(pageSize).lean();
            return result;
        }
        // khong phan trang && khong dung de find private key
        else {
            return await staffModel.find(condition).sort({ createdAt: -1 });
        }
    }
}

export default new staffService()
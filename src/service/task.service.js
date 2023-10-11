import taskModel from '../model/task.model'
class taskService{
    async create(data){
        return await taskModel.create(data)
    }

    async find(condition={}, pageNumber={}, pageSize={}, sort={createdAt:-1}){
        const skip = !!pageNumber && !!pageSize ? (pageNumber - 1) * pageSize : {};
        return await taskModel
            .find(condition)
            .sort(sort)
            .populate('serviceId')
            .populate('staffId')
            .skip(skip)
            .limit(pageSize)
            .lean();
    }

    async update(id, data){
        return await taskModel.findByIdAndUpdate(id, data, {returnDocument:'after', upsert:true})
    }

    async findById(id){
        return await taskModel
        .findById(id)
        .populate('staffId')
        .populate('serviceId')
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
        if (year != 0 && month != 0) {
            condition.$expr.$and.push({ $eq: [{ $year: '$' + field }, year] });
        }
        if (!!pageNumber && !!pageSize) {
            const skip = (pageNumber - 1) * pageSize;
            const result = await taskModel.find(condition).sort({ createdAt: -1 }).skip(skip).limit(pageSize).populate('serviceId')
            .populate('staffId').lean()
            return result;
        }
        // khong phan trang && khong dung de find private key
        else {
            return await taskModel.find(condition).sort({ createdAt: -1 });
        }
    }
    async delete(id){
        return taskModel.findByIdAndDelete(id)
    }
}

export default new taskService()
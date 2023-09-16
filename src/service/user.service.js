import userModel from '../model/user.model'

class UserService{
    async register(data){
        return await userModel.create(data)
    }

    async findByEmail(email){
        return await userModel.findOne({email, disable:false}).lean()
    }

    async findByPhoneNumber(phoneNumber){
        return await userModel.findOne({phoneNumber, disable:false}).lean()
    }

    async checkExistEmail(id, email){
        return userModel.findOne({email:email, disable:false,  _id:{$ne:id}}).lean()
    }
    async checkExistPhoneNumber(id, phoneNumber){
        return userModel.findOne({phoneNumber:phoneNumber, disable:false,  _id:{$ne:id}}).lean()
    }
    async updateUserById(id, data){
        return await userModel.findByIdAndUpdate(id, data, { returnDocument: "after", upsert: true }).lean()
    }
    async updateByEmail(email, password){
        return await userModel.findOneAndUpdate({email},{password},{returnDocument:'after'}).lean()
    }
    async findAllAndPagination(condition, pageNumber, pageSize, sort={ createdAt: -1 }){
        if (!!pageNumber && !!pageSize ) {
            const skip = (pageNumber - 1) * pageSize;
            const result = await userModel.find(condition).sort(sort).skip(skip).limit(pageSize).lean();
            return result;
        }
        // khong phan trang && khong dung de find private key
        else {
            return await userModel.find(condition).sort({ createdAt: -1 });
        } 
    }

    async findByDate(day, month, year, field, pageNumber, pageSize) {
        // co phan trang
        const condition = {
            $expr: {
                $and: [],
            },
            isAdmin:false
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
            const result = await userModel.find(condition).sort({ createdAt: -1 }).skip(skip).limit(pageSize).lean();
            return result;
        }
        // khong phan trang && khong dung de find private key
        else {
            return await userModel.find(condition).sort({ createdAt: -1 });
        }
    }
}

export default new UserService();
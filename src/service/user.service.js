import userModel from '../model/user.model'

class UserService{
    async register(data){
        return await userModel.create(data).lean()
    }

    async findByEmail(email){
        return await userModel.findOne({email}).lean()
    }

    async findByPhoneNumber(phoneNumber){
        return await userModel.findOne({phoneNumber}).lean()
    }

    async checkExistEmail(id, email){
        return userModel.findOne({email:email,  _id:{$ne:id}}).lean()
    }
    async checkExistPhoneNumber(id, phoneNumber){
        return userModel.findOne({phoneNumber:phoneNumber,  _id:{$ne:id}}).lean()
    }
    async updateUserById(id, data){
        return await userModel.findByIdAndUpdate(id, data, { returnDocument: "after", upsert: true }).lean()
    }
    async updateByEmail(email, password){
        return await userModel.findOneAndUpdate({email},{password},{returnDocument:'after'}).lean()
    }
}

export default new UserService();
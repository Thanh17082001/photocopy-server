import userModel from '../model/user.model'

class UserService{
    async register(data){
        return await userModel.create(data)
    }

    async findByEmail(email){
        return await userModel.findOne({email}).lean()
    }

    async findByPhoneNumber(phoneNumber){
        return await userModel.findOne({phoneNumber})
    }

    async checkExistEmail(id, email){
        return userModel.findOne({email:email,  _id:{$ne:id}})
    }
    async checkExistPhoneNumber(id, phoneNumber){
        return userModel.findOne({phoneNumber:phoneNumber,  _id:{$ne:id}})
    }
    async updateUserById(id, data){
        return await userModel.findByIdAndUpdate(id, data, { returnDocument: "after", upsert: true })
    }
    async updateByEmail(email, password){
        return await userModel.findOneAndUpdate({email},{password},{returnDocument:'after'})
    }
}

export default new UserService();
import userModel from '../model/user.model'

class UserService{
    async register(data){
        return await userModel.create(data)
    }

    async findByEmail(email){
        return await userModel.findOne({email})
    }

    async findByPhoneNumber(phoneNumber){
        return await userModel.findOne({phoneNumber})
    }
}

export default new UserService();
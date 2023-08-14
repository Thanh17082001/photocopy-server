import codeModel from "../model/code.model";

class codeService{
    async create(data){
        return await codeModel.create(data)        
    }

    async findAllByEmail(emailUser){
        return await codeModel.find({
            emailUser,
            used:false,
            resetTokenExpires: { $gt: Date.now() }
        })
        .sort({ createdAt: -1 })
        .lean()
    }

    async updateCodeUsed (email, code){
        return await codeModel.findOneAndUpdate({emailUser:email, codeNumber:code}, {used:true})
    }
}
export default new codeService()
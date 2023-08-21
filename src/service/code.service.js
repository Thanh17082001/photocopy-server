import codeModel from "../model/code.model";

class codeService{
    async create(data){
        return await codeModel.create(data)        
    }

    async findAllByEmail(emailUser){
        return await codeModel.find({
            emailUser,
            used:false,
            isValid:false,
            resetTokenExpires: { $gt: Date.now() }
        })
        .sort({ createdAt: -1 })
        .lean()
    }

    async updateCodeIsValid (email, code){
        return await codeModel.findOneAndUpdate(
            {emailUser:email, codeNumber:code}, 
            { isValid:true})
            .sort({ createdAt: -1 })
    }
    async getIValidByEmail(emailUser){
        return await codeModel.find({
            emailUser,
            used:false,
            isValid:true,
            resetTokenExpires: { $gt: Date.now() }
        })
        .sort({ createdAt: -1 })
        .lean()
    }
    async updateCodeUsed (email){
        return await codeModel.findOneAndUpdate(
            {emailUser:email, resetTokenExpires: { $gt: Date.now() }}
            ,{used:true})
            .sort({ createdAt: -1 })
    } 
}
export default new codeService()
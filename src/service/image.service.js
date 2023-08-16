import imageModel from "../model/image.model";

class imageSevice{
    async create(data){
        return await imageModel.create(data)
    }
    async findById(id){
        return await imageModel.findById(id)
    }
}

export default new imageSevice
import categoryModel from '../model/category.model';

class categoryService{
    async create (data){
        return await categoryModel.create(data)
    }
    async findAll(){
        return await categoryModel.find({})
    }
    async findByName(name){
        return await categoryModel.findOne({name})
    }
    async findById(id){
        return await categoryModel.findById(id)
    }
    async checkNameExist(id, name){
        return categoryModel.findOne({name, _id:{$ne:id}})

    }
    async update(id, data){
        return await categoryModel.findByIdAndUpdate(id,{$set: data}, {
            returnDocument:'after'
        })
    }
    async deleteById(id){
        return await categoryModel.findByIdAndDelete(id)
    }
}

export default new categoryService();
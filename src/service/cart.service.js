import cartModel from '../model/cart.model';

class cartService{
    async create (data){
        return await cartModel.create(data)
    }
    async findAll(){
        return await cartModel.find({})
    }
    async findByName(name){
        return await cartModel.findOne({name})
    }
    async findById(id){
        return await cartModel.findById(id)
    }
    async checkUserIdExist(userId){
        return cartModel.findOne({userId}).lean()

    }
    async update(id, data){
        return await cartModel.findByIdAndUpdate(id,{$set: data}, {
            returnDocument:'after'
        })
    }
    async deleteById(id){
        return await cartModel.findByIdAndDelete(id)
    }
}

export default new cartService();
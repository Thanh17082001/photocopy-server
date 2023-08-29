import productModel from '../model/product.model'

class productService{
    async create(data){
        return productModel.create(data)
    }
    async checkExistNameAndBrandId(name, brandId){
        return await productModel.findOne({brandId, name})
    }

    async findProduct(condition, pageNumber, pageSize){
        // co phan trang
        if(!!pageNumber && !!pageSize){
            const skip= (pageNumber-1)*pageSize
            return await productModel.find(condition).skip(skip).limit(pageSize)
        }
        // khong phan trang && khong dung de find private key
        else{
            return await productModel.find(condition)
        }
    }
    async findProductById(id){
        return await productModel.findById(id)
    }

    async updateProduct(id, data){
        return productModel.findByIdAndUpdate(id,{$set:data},{
            returnDocument:'after'
        }).lean()
    }

    async deleteProduct(id){
        return await productModel.findByIdAndDelete(id)
    }

    async findProductByIdAndRef(id){
        return await productModel.findById(id)
                    .populate('brandId',['_id', 'name'])
                    .populate('categoryId', ['_id', 'name'])
    }
}

export default new productService()
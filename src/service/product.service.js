import productModel from '../model/product.model'

class productService{
    async create(data){
        return productModel.create(data)
    }
}

export default new productService()
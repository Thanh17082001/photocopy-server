import productModel from '../model/product.model';

class productService {
    async create(data) {
        return productModel.create(data);
    }
    async checkExistNameAndBrandId(name, brandId) {
        return await productModel.findOne({ brandId, name });
    }

    async findProduct(condition, pageNumber, pageSize) {
        // co phan trang
        if (!!pageNumber && !!pageSize) {
            const skip = (pageNumber - 1) * pageSize;
            const result = await productModel.find(condition).skip(skip).limit(pageSize).sort({ createdAt: -1 }).lean();
            return result;
        }
        // khong phan trang && khong dung de find private key
        else {
            return await productModel.find(condition).sort({ createdAt: -1 });
        }
    }
    async findProductById(id) {
        return await productModel.findById(id);
    }

    async updateProduct(id, data) {
        return productModel
            .findByIdAndUpdate(
                id,
                { $set: data },
                {
                    returnDocument: 'after',
                },
            )
            .lean();
    }

    async updateAfterEntry(id, data) {
        return productModel
            .findByIdAndUpdate(
                id,
                {
                    $inc: { inputQuantity: data.inputQuantity },
                    $set: { priceImport: data.priceImport },
                },
                { returnDocument: 'after' },
            )
            .lean();
    }

    async deleteProduct(id) {
        return await productModel.findByIdAndDelete(id);
    }

    async findProductByIdAndRef(id) {
        return await productModel
            .findById(id)
            .populate('brandId', ['_id', 'name'])
            .populate('categoryId', ['_id', 'name']);
    }

    async search(data) {
        return await productModel.find({ $text: { $search: data } }).lean();
    }
}

export default new productService();

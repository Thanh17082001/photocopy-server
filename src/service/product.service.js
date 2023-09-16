import productModel from '../model/product.model';

class productService {
    async create(data) {
        return productModel.create(data);
    }
    async checkExistNameAndBrandId(name, brandId) {
        return await productModel.findOne({ brandId, name });
    }

    async findProduct(condition, pageNumber, pageSize, sort = { createdAt: -1 }) {
        // co phan trang
        if (!!pageNumber && !!pageSize && sort) {
            const skip = (pageNumber - 1) * pageSize;
            const result = await productModel.find(condition).sort(sort).skip(skip).limit(pageSize).lean();
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
                    dateEntyReceipt:data.dateEntyReceipt
                },
                { returnDocument: 'after', upsert: true },
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

   
    // loc theo ngay thang nam
    async findByDate(day, month, year, field, pageNumber, pageSize) {
        // co phan trang
        const condition = {
            $expr: {
                $and: [],
            },
        };
        if (day != 0) {
            condition.$expr.$and.push({ $eq: [{ $dayOfMonth: '$' + field }, day] });
        }
        if (month != 0) {
            condition.$expr.$and.push({ $eq: [{ $month: '$' + field }, month] });
        }
        if (year != 0) {
            condition.$expr.$and.push({ $eq: [{ $year: '$' + field }, year] });
        }
        if (!!pageNumber && !!pageSize) {
            const skip = (pageNumber - 1) * pageSize;
            const result = await productModel.find(condition).sort({ createdAt: -1 }).skip(skip).limit(pageSize).lean();
            return result;
        }
        // khong phan trang && khong dung de find private key
        else {
            return await productModel.find(condition).sort({ createdAt: -1 });
        }
    }
}

export default new productService();

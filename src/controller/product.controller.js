import productService from '../service/product.service';
import deepEqual from 'deep-equal';
class productController {
    async create(req, res) {
        try {
            if (!!req.body) {
                const image = !!req.file ? req.file.path.split('public')[1].replace(/\\/g, '/') : 'khong co';
                const data = {
                    brandId: req.body.brandId,
                    categoryId: req.body.categoryId,
                    name: req.body.name,
                    priceSale: req.body.priceSale,
                    priceRental: req.body.priceRental,
                    description: req.body.description || '',
                    image: image,
                    type: req.body.type,
                };
                const existProduct = await productService.checkExistNameAndBrandId(data.name, data.brandId);
                if (!!existProduct) {
                    res.json({ mes: 'Sản phẩm đã tồn tại hãy chỉnh sửa sản phẩm', status: false });
                    return;
                }
                await productService.create(data);
                res.json({ mes: 'Thêm sản phẩm thành công', status: true });
            } else {
                res.json({ mes: 'Dữ liệu trống', status: false });
            }
        } catch (error) {
            res.status(500).json({ error });
        }
    }

    // read
    async getAllProduct(req, res) {
        try {
            const pageNumber = req.query.pageNumber ? req.query.pageNumber : {}
            const pageSize = req.query.pageNumber ? req.query.pageSize : {}
            const result = await productService.findProduct({}, pageNumber, pageSize);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error });
        }
    }

    async getProductById(req, res) {
        try {
            const { id } = !!req.query ? req.query : '';
            const result = await productService.findProductById(id);
            res.json(result);
        } catch (error) {
            console.log(error);

            res.status(500).json({ error });
        }
    }

    async getProductByBrandId(req, res) {
        try {
            const { brandId } = req.query;
            const result = await productService.findProduct({ brandId });
            res.json(result);
        } catch (error) {
            res.status(500).json({ error });
        }
    }

    //update
    async update(req, res) {
        try {
            const { id } = !!req.query ? req.query : '';
            const product = await productService.findProductById(id);
            const oldProduct = {
                brandId: product.brandId.toString(),
                categoryId: product.categoryId.toString(),
                name: product.name,
                priceSale: product.priceSale,
                priceRental: product.priceRental,
                description: product.description,
                image: product.image,
                type: product.type,
            };
            const image = !!req.file ? req.file.path.split('public')[1].replace(/\\/g, '/') : product.image;
            if (!!req.body) {
                const newProduct = {
                    ...req.body,
                    image,
                };
                const isEqual = deepEqual(oldProduct, newProduct);
                if (isEqual) {
                    res.json({ mes: 'Chưa chỉnh sửa dữ liệu', status: false });
                } else {
                    const result=await productService.updateProduct(id, newProduct);
                    res.json({ mes: 'Cập nhật thành công', status: true, data:result });
                }
            } else {
                res.json({ mes: 'Dữ liệu không được bỏ trống', status: false });
            }
        } catch (error) {
            res.status(500).json({ error });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.query;
            const result = await productService.deleteProduct(id);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error });
        }
    }

    async getProductDetail(req, res){
        try {
            const { id } = req.query;
            const result = await productService.findProductByIdAndRef(id);
            if(!!result){
                res.json({status:true, data:result})
            }else{
                res.json({mes:'Không lấy được dữ liệu', status:false})
            }
        } catch (error) {
            res.status(500).json({ error });
        }
    }
    async sortProduct(req, res){
        try {
            const {type, field, pageNumber, pageSize}= req.query
            if(type==0){
                const data={
                    [field]:Number(type)
                }
                const result = await productService.findProduct(data, pageNumber, pageSize);
                res.json(result);
            }
            else{
                const data={
                    [field]:Number(type)
                }
                const result = await productService.findProduct({}, pageNumber, pageSize, data);
                res.json(result);
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ error });
        }
    }
}

export default new productController();

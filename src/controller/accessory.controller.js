import { access } from 'fs';
import accessoryService from '../service/accessory.service';
import deepEqual from 'deep-equal';
class productController {
    async create(req, res) {
        try {
            if (!!req.body) {
                const image = !!req.file ? req.file.path.split('public')[1].replace(/\\/g, '/') : '';
                const data = {
                    ...req.body,
                    image: image,
                };
                data.brandId=!!req.body.brandId ? req.body.brandId : null
                await accessoryService.create(data);
                res.json({ mes: 'Thêm phụ kiện thành công', status: true });
            } else {
                res.json({ mes: 'Dữ liệu trống', status: false });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
    }

    // read
    async getAllAccessory(req, res) {
        try {
            const pageNumber = req.query.pageNumber ? req.query.pageNumber : {}
            const pageSize = req.query.pageSize ? req.query.pageSize : {}
            const result = await accessoryService.find( {}, pageNumber, pageSize);
            res.json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
    }

    async getById(req, res) {
        try {
            const { id } = !!req.query ? req.query : '';
            const result = await accessoryService.finById(id);
            res.json(result);
        } catch (error) {
            console.log(error);

            res.status(500).json({ error });
        }
    }
    //update
    async update(req, res) {
        try {
            
            const { id } = !!req.query ? req.query : '';
            const accessory = await accessoryService.finById(id);
            const covertFits= accessory.fits.map(fit => ({product:fit.product._id}))
            accessory.fits=[]
            accessory.fits=[...covertFits]
            const oldAcc = {
                brandId:accessory.brandId?.toString() ,
                typeId: accessory.typeId?.toString(),
                name: accessory.name,
                priceSale: accessory.priceSale,
                description: accessory.description,
                image: accessory.image,
                fits:accessory.fits
            };
            const image = !!req.file ? req.file.path.split('public')[1].replace(/\\/g, '/') : accessory.image;
            if (!!req.body) {
                const newAcc = {
                    brandId:req.body.brandId ,
                    typeId: req.body.typeId,
                    name: req.body.name,
                    priceSale: req.body.priceSale,
                    description: req.body.description,
                    image,
                    fits:!!req.body.fits ? req.body.fits :[]
                };
                const isEqual = deepEqual(oldAcc, newAcc)
                if (isEqual) {
                    res.json({ mes: 'Chưa chỉnh sửa dữ liệu', status: false })
                } else {
                    const result=await accessoryService.update(id, newAcc);
                    res.json({ mes: 'Cập nhật thành công', status: true, data:result });
                }
            } else {
                res.json({ mes: 'Dữ liệu không được bỏ trống', status: false });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
    }

    // async delete(req, res) {
    //     try {
    //         const { id } = req.query;
    //         const result = await productService.deleteProduct(id);
    //         res.json(result);
    //     } catch (error) {
    //         res.status(500).json({ error });
    //     }
    // }

    async filterByFullDate(req, res){
        try {
            const {month=undefined}= req.query
            const {day=undefined}= req.query
            const {year=undefined}= req.query
            const {field}= req.query
            const pageNumber = req.query.pageNumber ? req.query.pageNumber : {}
            const pageSize = req.query.pageSize ? req.query.pageSize : {}
            const result = await accessoryService.findByDate(day,month,year,field,pageNumber,pageSize)
            console.log(result);
            res.json(result);
            
        } catch (error) {
            console.log(error);
        }
    }
    async filterProduct(req, res){
        try {
            const {type, field, pageNumber, pageSize}= req.query
            if(field!='createdAt'){
                const condition={
                    [field]:type
                }
                const result = await accessoryService.find(condition, pageNumber, pageSize);
                res.json(result);
            }
            else{
                const sort={
                    [field]:Number(type),
                    //số lượng bán >0
                }
                const result = await accessoryService.find({}, pageNumber, pageSize, sort);
                res.json(result);
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ error });
        }
    }
    async getProductByCondition(req, res) {
        try {
            const { condition={} } = req.body;
            const { sort={} } = req.body;
            const pageNumber = req.body.pageNumber ? req.body.pageNumber : {}
            const pageSize = req.body.pageSize ? req.body.pageSize : {}
            const result = await accessoryService.find({... condition }, pageNumber, pageSize, sort);
            res.json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error })
        }
    }
    
}



export default new productController();

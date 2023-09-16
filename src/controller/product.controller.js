import productService from '../service/product.service';
import deepEqual from 'deep-equal';
import puppeteer from 'puppeteer';
import XLSX from 'xlsx'
const fs = require("fs");
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
            const pageSize = req.query.pageSize ? req.query.pageSize : {}
            const result = await productService.findProduct( {}, pageNumber, pageSize);
            res.json(result);
        } catch (error) {
            console.log(error);
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
            res.status(500).json({ error })
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

    async filterProduct(req, res){
        try {
            const {type, field, pageNumber, pageSize}= req.query
            if(field!='createdAt'){
                const condition={
                    [field]:type
                }
                const result = await productService.findProduct(condition, pageNumber, pageSize);
                res.json(result);
            }
            else{
                const sort={
                    [field]:Number(type),
                    //số lượng bán >0
                }
                const result = await productService.findProduct({}, pageNumber, pageSize, sort);
                res.json(result);
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ error });
        }
    }

    async search(req, res){
        try {
            console.log(req.body);
            const data= req.body.searchValue
            const pageNumber = req.query.pageNumber ? req.query.pageNumber : {}
            const pageSize = req.query.pageSize ? req.query.pageSize : {}
            const numberSearch= Number(data) ? [
                {inputQuantity:{ $gte: Number(data) }}, 
                {soldQuantity:{ $gte: Number(data) }}, 
                {priceSale:{ $gte: Number(data) }}, 
                { priceImport:{ $gte: Number(data) }},
                {priceRental:{ $gte: Number(data) }},
            ] : []
            const searchValue= [
                { name: { $regex: '.*' + data + '.*' } },
                { description: { $regex: '.*' + data + '.*' } },
                {type:{ $regex: '.*' + data + '.*' } },
                ...numberSearch
              ]
            const result=await productService.findProduct({$or: searchValue}, pageNumber, pageSize)
            res.json(result)
        } catch (error) {
            res.status(500).json({ error:error.message });
        }
    }

    async exportExcel(req, res){
        try {
            const data = req.body.data
            // const data = await productService.findProduct({}, 1, 8) // Dữ liệu bạn muốn xuất ra tệp Excel
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
            const radom=Math.random()*10
            
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

            res.setHeader("Content-Disposition", `attachment; filename=exported-file${radom}.xlsx`);
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.send(excelBuffer);

        } catch (error) {
            console.log(error);
        }
    }

    async exportPDF(req, res){
        try {
            const browser = await puppeteer.launch({ headless: 'new' });
            const page = await browser.newPage();
            const htmlString= req.body.data
           
            await page.setContent(htmlString);
            const blob=await page.pdf({
                format:'A4',
                printBackground:true
            })

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename=table.pdf');
            // Gửi buffer của tệp PDF về client
            res.send(blob);

        } catch (error) {
            console.log(error);
            res.status(500).json(error)
        }
    }

    async filterByFullDate(req, res){
        try {
            const {month=undefined}= req.query
            const {day=undefined}= req.query
            const {year=undefined}= req.query
            const {field}= req.query
            const pageNumber = req.query.pageNumber ? req.query.pageNumber : {}
            const pageSize = req.query.pageSize ? req.query.pageSize : {}
            const result = await productService.findByDate(day,month,year,field,pageNumber,pageSize)
            res.json(result);
            
            
        } catch (error) {
            console.log(error);
        }
    }
}



export default new productController();

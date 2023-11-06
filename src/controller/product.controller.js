import productService from '../service/product.service';
import accessoryService from '../service/accessory.service'
import deepEqual from 'deep-equal';
import puppeteer from 'puppeteer';
import XLSX from 'xlsx'
const fs = require("fs")
class productController {
    async create(req, res) {
        try {
            if (!!req.body) {
                const image = !!req.file ? req.file.path.split('public')[1].replace(/\\/g, '/') : 'khong co';
                const data = {
                    ...req.body,
                    image: image,
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

            res.status(500).json({ error })
        }
    }

    async getProductByCondition(req, res) {
        try {
            const { condition={} } = req.body;
            const { sort={} } = req.body;
            const pageNumber = req.body.pageNumber ? req.body.pageNumber : {}
            const pageSize = req.body.pageSize ? req.body.pageSize : {}
            const result = await productService.findProduct({... condition }, pageNumber, pageSize, sort);
            res.json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error })
        }
    }
    async getProductByBrandId(req, res) {
        try {
            const { brandId } = req.query;
            const pageNumber = req.query.pageNumber ? req.query.pageNumber : {}
            const pageSize = req.query.pageSize ? req.query.pageSize : {}
            const result = await productService.findProduct({ brandId }, pageNumber, pageSize);
            res.json(result);
        } catch (error) {
            console.log(error);
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
                typeId: product.typeId.toString(),
                name: product.name,
                priceSale: product.priceSale,
                priceRental: product.priceRental,
                description: product.description,
                image: product.image,
                warrantyTime:product.warrantyTime
            };
            const image = !!req.file ? req.file.path.split('public')[1].replace(/\\/g, '/') : product.image;
            if (!!req.body) {
                const newProduct = {
                    brandId: req.body.brandId.toString(),
                    categoryId: req.body.categoryId.toString(),
                    typeId: req.body.typeId.toString(),
                    name: req.body.name,
                    priceSale: req.body.priceSale,
                    priceRental: req.body.priceRental,
                    description: req.body.description,
                    image,
                    warrantyTime:req.body.warrantyTime
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
            res.status(500).json({ error })
        }
    }

    async filterProduct(req, res){
        try {
            const {type, field, pageNumber, pageSize}= req.query
            if(field!='createdAt'){
                const condition={
                    [field]:type
                }
                console.log(condition);
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
            res.status(500).json({ error })
        }
    }

    async search(req, res){
        try {
            const data= req.body.searchValue
            const pageNumber = req.query.pageNumber ? req.query.pageNumber : {}
            const pageSize = req.query.pageSize ? req.query.pageSize : {}
            const numberSearch= Number(data) ? [
                {priceSale:{ $gte: Number(data), $lte: Number(data)+2000000 }},
            ] : []
            const searchValue= [
                { name: { $regex:  data ,  $options: 'i'  } },
                { description: { $regex:  data ,  $options: 'i'   } },
                ...numberSearch
              ]
              console.log(searchValue);
            const result1=await productService.findProduct({$or: searchValue}, pageNumber, pageSize)
            const result2=await accessoryService.find({$or: searchValue}, pageNumber, pageSize)
            result1.forEach(item=> item.typeProduct='product')
            result2.forEach(item=> item.typeProduct='accessory')
              const result =[...result1, ...result2]
            res.json(result)
        } catch (error) {
            console.log(error);
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
            const {pageDirection} = req.query
            const browser = await puppeteer.launch({ headless: 'new' });
            const page = await browser.newPage();
            const htmlString= req.body.data
            await page.setContent(htmlString);
            let blob
            if(pageDirection ==='vertical'){
                 blob=await page.pdf({
                    format:'A4',
                    printBackground:true,
                })
            }
            else{
                 blob=await page.pdf({
                    format:'A4',
                    printBackground:true,
                    landscape:true
                })
            }

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

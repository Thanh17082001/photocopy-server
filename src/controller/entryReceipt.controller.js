import entryReceiptService from "../service/entryReceipt.service";
import productService from "../service/product.service";
class entryReceiptController{
    async create(req, res) {
      try {
        const user = req.session.auth?.user || undefined
        if(!!user){
            if(!!req.body){
                // const image = !!req.file ? req.file.path.split('public')[1].replace(/\\/g, '/') : undefined;
                const data={
                    ...req.body,
                    createBy:user._id,
                    image: !!req.file ?
                        {
                            data:req.file.buffer,
                            contentType:req.file.mimetype
                        } : undefined
                }
                const result = await entryReceiptService.create(data);
                if(!!result){
                    const products= result.products;
                    products.forEach(async (product) =>{
                        await productService.updateAfterEntry(
                            product.idProduct,
                            {
                            inputQuantity:product.inputQuantity,
                            priceImport:product.priceImport,
                            dateEntyReceipt:new Date()
                            }
                        )

                    })
                    res.json({mes:'Tạo thành công', status:true})
                }
                else{
                    res.json({mes:'Tạo thất bại', status:false})
                }
            }
            else{
                res.json({mes:'Bạn chưa gửi dữ liệu', status:false})
            }
        }
        else{
            res.json({mes:'Bạn chưa đăng nhập', status:false})
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({error:error.message})
      }
    }

    async getEntry(req, res){
        try {
            const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1
            const pageSize = req.query.pageNumber ? req.query.pageSize : {}

            const result = await entryReceiptService.findEntry({}, pageNumber, pageSize,{createdAt:-1})
            res.json(result)
        } catch (error) {
        console.log(error);
            res.status(500).json({error:error.message})
        }
    }

    async getByIdEntry(req, res){
        try {
            const id= req.query.id || false
            if(!!id){
                const result = await entryReceiptService.findById(id)
                res.json(result)
            }
            else{
                res.json({mes:'Truyền tham số id tại query', status:false})
            }
        } catch (error) {
            res.status(500).json({error:error.message})
        }
    }
    // async getById(req, res){
    //     try {
    //         const result = await imageService.findById(req.query.id)
    //         res.send(result.image.data)
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).json({error})
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
            const result = await entryReceiptService.findByDate(day,month,year,field,pageNumber,pageSize)
            res.json(result);
            
            
        } catch (error) {
            console.log(error);
        }
    }
}

export default new entryReceiptController()
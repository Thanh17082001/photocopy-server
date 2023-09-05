import entryReceiptService from "../service/entryReceipt.service";
import productService from "../service/product.service";
class entryReceiptController{
    async create(req, res) {
      try {
        const user = req.session.auth?.user || undefined
        if(!!user){
            if(!!req.body){
                const data={
                    ...req.body,
                    createBy:user.fullName
                }
                const result = await entryReceiptService.create(data);
                if(!!result){
                    const products= result.products;
                    products.forEach(async (product) =>{
                        await productService.updateAfterEntry(
                            product.idProduct,
                            {
                            inputQuantity:product.inputQuantity,
                            priceImport:product.priceImport
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
}

export default new entryReceiptController()
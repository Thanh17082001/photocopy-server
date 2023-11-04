import cartService from "../service/cart.service";
class cartController{
    async create(req, res){
        try {
            if(!!req.body){
                const {userId} = req.body
                const exitsUserId = await cartService.checkUserIdExist(userId)
                const data={
                    ...req.body,
                    products:[req.body.product]
                }
                if(!!exitsUserId){
                    let products= exitsUserId.products
                    const index=exitsUserId.products.findIndex(product => product.id == req.body.product.id)
                        if(index!==-1){
                            products[index].quantityCart+=req.body.product.quantityCart
                        }
                        else{
                            products.unshift(req.body.product)

                        }
                    const result=await cartService.update(exitsUserId._id, {products:products})
                    res.json({status:true, result})
                    return;
                }
                else{
                    const result=await cartService.create(data)
                    res.send({mes:'Thêm thành công', status:true, result});
                }
            }
            else{
                res.json({mes:'Tên không được bỏ trống', status:false})
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({error})
        }
    }
    async getByUserId(req, res){
        try {
            const {userId=undefined}=req.query
            if(!!userId){
                const result = await cartService.checkUserIdExist(userId)
                res.json(result)
            }
            else{
                res.json({})
            }
        } catch (error) {
            console.log(error);
        }
    }
    async getAll(req, res){
        try {
            const result = await cartService.findAll()
            res.json(result)
        } catch (error) {
            res.status(500).json({error})
        }
    }
    async updateQuantity(req, res){
        try {
            const {id=undefined, userId} = req.query
            const data = {
                ...req.body
            }
            const exitsUserId = await cartService.checkUserIdExist(userId)
            if(!!exitsUserId){
                await cartService.update(exitsUserId._id, data)
                res.json({status:true})
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({error})
        }
    }
    async delete(req, res){
        try {
            const {id}=req.query
            const result = await cartService.deleteById(id)
            !!result=== true ? res.json({mes:"Xóa thành công", status:true}) 
                             : res.json({mes:"Xóa không thành công", status:false})
        } catch (error) {
            res.status(500).json({error})
        }
    }
}

export default new cartController();
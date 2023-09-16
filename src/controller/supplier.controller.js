import supplierService from "../service/supplier.service";

class supplierController{
    async  create(req, res){
        try {
            const data= {
                ...req.body.data
            }
            const result = await supplierService.create(data)
            if(!!result){
                res.json({mes:'Tạo thành công', status:true})
            }
            else{
                res.json({mes:'Tạo không thành công', status:false})

            }
        } catch (error) {
            console.log(error);
        }
    }

    async getAll(req, res){
        try {
            const result = await supplierService.find()
            res.json(result)
        } catch (error) {
            console.log(error);
            
        }
    }
}
export default new supplierController()
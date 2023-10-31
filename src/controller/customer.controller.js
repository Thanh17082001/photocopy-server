import customerService from "../service/customer.service";
import deepEqual from "deep-equal";
class customerController{
    async  create(req, res) {
        try {
            if(!!req.body){
                const exit = await customerService.find({phone:req.body.phone, email:req.body.email, fullName:req.body.fullName})
                if(exit.length >0){
                    res.json({mes:'Khách hàng tồn tại',status:false, result:exit[0]})
                    return;
                }
                 const result =await customerService.create(req.body)
                 res.json({mes:'Thêm khách hàng thành công',status:true, result});
            }
            else{
                res.json({mes:'Thêm khách hàng không thành công',status:false})
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({error})
        }
    }

    async getAll(req, res){
        try {
            const {pageNumber=undefined} = req.query
            const {pageSize=undefined} = req.query
            const result = await customerService.find({},pageNumber,pageSize)
            res.json(result)
        } catch (error) {
            console.log(error);
            res.status(500).json({error})
        }
    }

    async getById(req, res){
        try {
            const {id=undefined} = req.query
            if(!!id){
                const result = await customerService.findById(id)
                res.json(result)
            }
            else{
                res.json({mes:'Truyền id query'})
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({error})
        }
    }

    async update(req, res){
        try {
            const {id=undefined} = req.query
            if(!!id && !!req.body){
                const customer= await customerService.findById(id)
                const oldeCustomer= {
                    fullName:customer.fullName,
                    address:customer.address,
                    phone:customer.phone,
                    email:customer.email,
                }
                const newCustomer= {
                    fullName:req.body.fullName,
                    address:req.body.address,
                    phone:req.body.phone,
                    email:req.body.email,
                }
                const equal = deepEqual(oldeCustomer, newCustomer)
    
                if(equal){
                    res.json({mes:'Chưa thay đổi dữ liẹu', status:false})
                }
                else{
                    const result = await customerService.update(id, newCustomer)
                    res.json({mes:'Cập nhật thành công', status:true, data:result})
                }
            }
            else{
                res.status(400).json({mes:'Chưa truyền dữ liệu'})
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({error})
        }
    }
    
}

export default new customerController()
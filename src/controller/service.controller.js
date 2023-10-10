import serviceService from "../service/service.service";
import deepEqual from "deep-equal";
class serviceController{
    async create(req, res) {
        try {
            const data = {
                ...req.body,
            }
            const result = await serviceService.create(data)
            !!result ? res.json({mes:'Thêm dịch vụ thành công', status:true}): res.json({mes:'Thêm không thành công', status:false})
        } catch (error) {
            console.log(error);
            res.status(500).json({error})
        }
    }

    async getAll(req, res){
        try {
            const result = await serviceService.find()
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
                const result = await serviceService.findById(id)
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
                const service= await serviceService.findById(id)
                const servicesOld = {
                    name:service.name,
                    price:service.price,
                    description: service.description
                }
                const serviceNew= {
                    name:req.body.name,
                    price:req.body.price,
                    description: req.body.description
                }
                const isEqual = deepEqual(servicesOld, serviceNew)
                if(isEqual || !!!req.body){
                    res.json({ mes: 'Chưa chỉnh sửa dữ liệu', status: false });
                }
                else{
                    const result = await serviceService.update(id,newsNew)
                    res.json({mes:'Cập nhật thành công', status:true, data:result})
                }
            }
            else{
                res.status(400).json({mes:'Chưa truyền dữ liệu', status:false})
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({error})
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
            const result = await serviceService.findByDate(day,month,year,field,pageNumber,pageSize)
            res.json(result);
            
            
        } catch (error) {
            console.log(error);
        }
    }

    async delete(req, res){
        try {
            const {id=undefined} = req.query
            if(!!id){
                const result  = await serviceService.delete(id)
                if(!!result){
                    res.json({mes:'Xóa thành công',status:true})
                }
                else{
                    res.json({mes:'Xóa không thành công',status:false})

                }
            }
            else{
                res.json({mes:'Chưa truyền tham số id',status:false})
            }
        } catch (error) {
            console.log(error);
        }
    }
    
}

export default new serviceController()
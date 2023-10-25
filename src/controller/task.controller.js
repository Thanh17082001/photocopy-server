import { response } from "express";
import taskService from "../service/task.service";
import deepEqual from "deep-equal";
import accessoryService from "../service/accessory.service";
class taskController{
    async create(req, res) {
        try {
            const data = {
                ...req.body,
            }
            const result = await taskService.create(data)
            !!result ? res.json({mes:'Thêm công việc thành công', status:true,result}): res.json({mes:'Thêm không thành công', status:false})
        } catch (error) {
            console.log(error);
            res.status(500).json({error})
        }
    }

    async getAll(req, res){
        try {
            const result = await taskService.find()
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
                const result = await taskService.findById(id)
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
                const task= await taskService.findById(id)
                const tasksOld = {
                    serviceId:task.serviceId.toString(),
                    staffId:task.staffId._id.toString(),
                    totalAmount:task.totalAmount,
                    nameCustomer:task.nameCustomer,
                    phone:task.phone,
                    address:task.address,
                    note:task.note
                }
                const taskNew= {
                    serviceId:req.body.serviceId,
                    staffId:req.body.staffId,
                    totalAmount:req.body.totalAmount,
                    nameCustomer:req.body.nameCustomer,
                    phone:req.body.phone,
                    address:req.body.address,
                    note:req.body.note
                }
                const isEqual = deepEqual(tasksOld, taskNew)
                if(isEqual || !!!req.body){
                    res.json({ mes: 'Chưa chỉnh sửa dữ liệu', status: false });
                }
                else{
                    const result = await taskService.update(id,taskNew)
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

    async updateStatus(req, res){
        try {
            const {id=undefined} = req.query
            if(!!id && !!req.body){
                const result = await taskService.update(id,req.body)
                    res.json({mes:'Cập nhật thành công', status:true, data:result})
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
            const result = await taskService.findByDate(day,month,year,field,pageNumber,pageSize)
            res.json(result);
            
            
        } catch (error) {
            console.log(error);
        }
    }

    async delete(req, res){
        try {
            const {id=undefined} = req.query
            if(!!id){
                const result  = await taskService.delete(id)
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

    async report(req, res){
        try {
            const data = req.body
            const {id=undefined} = req.query
            data.image = !!req.file ? req.file.path.split('public')[1].replace(/\\/g, '/') : '';
            if(!!data && !!id){
                const update = await taskService.update(id,data)
                if(!!update){
                    const accessorys = data.accessorys
                         accessorys.forEach(async (product) =>{
                            await accessoryService.updateAfterOrder(product.accessoryId,{quantity:product.quantity})
                         })
                    res.json({mes:'Báo cáo thành công',status:true,result:update})
                }
                else{
                    res.json({mes:'Không thành công',status:false})
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    async changeTime(req, res){
        try {
            const data = req.body
            const {id=undefined}=req.query
            if(!!data || !!id){
                const result = await taskService.update(id, data)
                if(!!result){
                    res.json({mes:'Thành công',status:true})
                }
                else{
                    res.json({mes:'Không thành công',status:false})

                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    
}

export default new taskController()
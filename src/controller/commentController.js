import deepEqual from "deep-equal";
import commentService from "../service/comment.service";

class commentController{
    async create(req, res){
        try {
            const image = !!req.file ? req.file.path.split('public')[1].replace(/\\/g, '/') : undefined;
            console.log(req.file);
            const data= {
                ...req.body,
                image
            }
            if(!!data){
                await commentService.create(data)
                res.json({mes:'Thêm thành công', status:true})
            }
            else{
                res.json({mes:"Dữ liệu sai định dạng", status:false})
            }
        } catch (error) {
            res.json({status:false, mes: error})
        }
    }
    async getByIdProduct(req, res){
        try {
            const {productId}= req.body
            const pageNumber = req.body.pageNumber ? req.body.pageNumber : {}
            const pageSize = req.body.pageSize ? req.body.pageSize : {}
            const approve = req.body.approve ? true : undefined
            const comments = await commentService.findByIdProduct({productId, approve}, pageNumber, pageSize)
            if(!!!comments){
                res.json({mes:'Sản phẩm không tồn tại', status:false, data:[]})
            }
            else{
                res.json({data:comments, status:true})
            }
        } catch (error) {
            res.json({status:false, mes: error})
        }
    }
    async getAll(req, res){
        try {
            const {pageNumber=undefined} = req.query
            const {pageSize=undefined} = req.query
            const result = await commentService.find({},pageNumber,pageSize)
            res.json(result)
        } catch (error) {
            console.log(error);
            res.status(500).json({error})
        }
    }

    async update(req, res){
        try {
           const {type} = req.body
           const {id} = req.query
           if(type==1){
                const result = await commentService.updateById(id, {approve:true})
                res.json({status:true, result})
           }
           else if(type==-1){
            const result = await commentService.updateById(id, {approve:false})
            res.json({status:true, result})
           }
        } catch (error) {
            res.json({status:false, mes: 'Cập nhật không thành công lỗi server'})
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
            const result = await commentService.findByDate(day,month,year,field,pageNumber,pageSize)
            res.json(result);
            
            
        } catch (error) {
            console.log(error);
        }
    }
    async getById(req, res){
        try {
            const {id=undefined} = req.query
            if(!!id){
                const result = await commentService.findById(id)
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
}

export default new commentController()
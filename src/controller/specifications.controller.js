import deepEqual from "deep-equal";
import specificationsService from "../service/specifications.service";

class specificationsController{
    async create(req, res){
        try {
            const {idProduct} = req.body
            const data= {
                ...req.body
            }
            const specifications = await specificationsService.findByIdProduct(idProduct)
            if(!!!specifications){
                await specificationsService.create(data)
                res.json({mes:'Thêm thành công', status:true})
            }
            else{
                res.json({mes:"Sản phẩm tồn tại", status:false})
            }
        } catch (error) {
            res.json({status:false, mes: error})
        }
    }
    async getByIdProduct(req, res){
        try {
            const {idProduct}= req.query
            const specifications = await specificationsService.findByIdProduct(idProduct)
            if(!!!specifications){
                res.json({mes:'Sản phẩm không tồn tại', status:false, data:{}})
            }
            else{
                res.json({data:specifications, status:true})
            }
        } catch (error) {
            res.json({status:false, mes: error})
        }
    }

    async update(req, res){
        try {
            const id= req.query.id
            const specifications = await specificationsService.findByIdProduct(req.body.idProduct)
            const oldSpecifications={
                ...specifications,
                _id:undefined,
                idProduct:undefined,
                createdAt:undefined,
                updatedAt:undefined
            }
            const newSpecifications={
                ...req.body,
                _id:undefined,
                idProduct:undefined,
                createdAt:undefined,
                updatedAt:undefined
            }
            console.log(newSpecifications);
            console.log(oldSpecifications);
            const isEqual= deepEqual(oldSpecifications, newSpecifications)
            if(isEqual){
                res.json({mes:'Chưa có bất kỳ thay đổi nào', status:false})
            }
            else{
                const result = await specificationsService.updateById(id, newSpecifications)
                res.json({status:true, data:result, mes:'Cập nhật thành công'})
            }
        } catch (error) {
            res.json({status:false, mes: 'Cập nhật không thành công lỗi server'})
        }
    }
}

export default new specificationsController()
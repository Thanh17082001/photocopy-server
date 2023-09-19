import roleService from "../service/role.service";
import deepEqual from "deep-equal";
class roleController{
    async  create(req, res) {
        try {
            if(!!req.body){
                 await roleService.create(req.body)
                 res.json({mes:'Thêm quyền thành công',status:true})
            }
            else{
                res.json({mes:'Thêm quyền không thành công',status:false})
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
            const result = await roleService.find({},pageNumber,pageSize)
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
                const result = await roleService.findById(id)
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
                const role= await roleService.findById(id)
                const oldRole= {
                    roleName:role.roleName
                }
                const newRole= {
                    roleName:req.body.roleName
                }
                const equal = deepEqual(oldRole, newRole)
    
                if(equal){
                    res.json({mes:'Chưa thay đổi dữ liẹu', status:false})
                }
                else{
                    const result = await roleService.update(id, newRole)
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

export default new roleController()
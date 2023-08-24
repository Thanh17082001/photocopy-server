import categoryService from "../service/category.service";
import deepEqual from "deep-equal";

class categoryController{
    async create(req, res){
        try {
            if(!!req.body.name){
                const {name} = req.body
                const exitsName = await categoryService.findByName(name)
                const data={
                    name,
                }
                if(!!exitsName){
                    res.json({mes:'Loại sản phẩm đã tồn tại', status:false})
                    return;
                }
                await categoryService.create(data)
                res.send({mes:'Thêm thành công', status:true});
            }
            else{
                res.json({mes:'Tên không được bỏ trống', status:false})
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({error})
        }
    }

    async getAll(req, res){
        try {
            const result = await categoryService.findAll()
            res.json(result)
        } catch (error) {
            res.status(500).json({error})
        }
    }
    
}

export default new categoryController();
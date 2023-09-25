import typeAccService from "../service/typeAcc.service";

class typeAccController{
    async create(req, res){
        try {
            if(!!req.body.name){
                const {name} = req.body
                const exitsName = await typeAccService.findByName(name)
                const data={
                    name,
                }
                if(!!exitsName){
                    res.json({mes:'Loại sản phẩm đã tồn tại', status:false})
                    return;
                }
                await typeAccService.create(data)
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
            const result = await typeAccService.findAll()
            res.json(result)
        } catch (error) {
            res.status(500).json({error})
        }
    }
    
}

export default new typeAccController();
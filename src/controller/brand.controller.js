import brandService from "../service/brand.service";
import deepEqual from "deep-equal";

class brandController{
    async create(req, res){
        try {
                 //Cach luu nhi phan vao DB
            // try {
            //     const data ={
            //         name:req.file.originalname,
            //         image:{
            //             data:req.file.buffer,
            //             contentType:req.file.mimetype
            //         }
            //     }
            //     const result = await imageService.create(data)
            //     res.json(result)
            // } catch (error) {
            //     console.log(error);
            //     res.status(500).json({error})
            // }
            // console.log(req.file);


            const relativePath = req.file.path.split('public')[1].replace(/\\/g, '/') || '';
            if(!!req.body.name){
                const {name} = req.body
                const exitsName = await brandService.findByName(name)
                const data={
                    name,
                    image:relativePath
                }
                if(!!exitsName){
                    res.json({mes:'Thương hiệu đã tồn tại nếu có thay đổi vui lòng chỉnh sửa', status:false})
                    return;
                }
                await brandService.create(data)
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
            const result = await brandService.findAll()
            res.json(result)
        } catch (error) {
            res.status(500).json({error})
        }
    }
    async update(req, res){
        try {
            const relativePath = req.file.path.split('public')[1].replace(/\\/g, '/');
            const {id}= req.query
            const brand = await brandService.findById(id)
            const oldBrand = {
                name:brand.name,
                image:brand.image
            }
            const newBrand={
                name:req.body.name,
                image:relativePath
            }
            const isEqual= deepEqual(oldBrand,newBrand)
            if(isEqual){
                res.json({mes:'Không có sự thay đổi', status:false})
            }
            else{
                const result = await brandService.update(id, newBrand)
                res.json(result)
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({error})
        }
    }
    // luu anh vao DB
    // async getById(req, res){
    //     try {
    //         const result = await imageService.findById(req.query.id)
    //         res.send(result.image.data)
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).json({error})
    //     }
    // }

    async delete(req, res){
        try {
            const {id}=req.query
            const result = await brandService.deleteById(id)
            !!result=== true ? res.json({mes:"Xóa thành công", status:true}) 
                             : res.json({mes:"Xóa không thành công", status:false})
        } catch (error) {
            res.status(500).json({error})
        }
    }
}

export default new brandController();
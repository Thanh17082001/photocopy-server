import newsService from "../service/news.service";
import deepEqual from "deep-equal";
class newsController{
    async create(req, res) {
        try {
            const image = !!req.file ? req.file.path.split('public')[1].replace(/\\/g, '/') : '';
            const data = {
                ...req.body,
                image: image||undefined
            }
            const result = await newsService.create(data)
            !!result ? res.json({mes:'Thêm tin tức thành công', status:true}): res.json({mes:'Thêm không thành công', status:false})
        } catch (error) {
            console.log(error);
            res.status(500).json({error})
        }
    }

    async getAll(req, res){
        try {
            const result = await newsService.find()
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
                const result = await newsService.findById(id)
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
            console.log(req.body);
            if(!!id && !!req.body){
                const news= await newsService.findById(id)
                const newsOld = {
                    createBy:news.createBy?.toString(),
                    title:news.title,
                    content:news.content,
                    image:news.image
                }
                const image = !!req.file ? req.file.path.split('public')[1].replace(/\\/g, '/') : news.image;
                const newsNew= {
                    createBy:req.body.createBy,
                    title:req.body.title,
                    content:req.body.content,
                    image:image 
                }
                const isEqual = deepEqual(newsOld, newsNew)
                if(isEqual || !!!req.body){
                    res.json({ mes: 'Chưa chỉnh sửa dữ liệu', status: false });
                }
                else{
                    const result = await newsService.update(id,newsNew)
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
            const result = await newsService.findByDate(day,month,year,field,pageNumber,pageSize)
            res.json(result);
            
            
        } catch (error) {
            console.log(error);
        }
    }

    async delete(req, res){
        try {
            const {id=undefined} = req.query
            if(!!id){
                const result  = await newsService.delete(id)
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

export default new newsController()
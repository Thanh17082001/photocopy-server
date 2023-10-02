import newsService from "../service/news.service";
import deepEqual from "deep-equal";
class newsController{
    async create(req, res) {
        try {
            const image = !!req.file ? req.file.path.split('public')[1].replace(/\\/g, '/') : '';
            const data = {
                ...req.body,
                logo: image||undefined
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
                const result = await orderService.findById(id)
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
                const news= await newsService.findById(id)
                const newsOld = {
                    title:news.title,
                    content:news.content,
                    image:news.image
                }
                const image = !!req.file ? req.file.path.split('public')[1].replace(/\\/g, '/') : companyFindById.logo;
                const newsNew= {
                    title:req.body.title,
                    content:req.body.content,
                    image:image 
                }
                const isEqual = deepEqual(newsOld, newsNew)
                console.log(isEqual);
                if(isEqual || !!!req.body){
                    res.json({ mes: 'Chưa chỉnh sửa dữ liệu', status: false });
                }
                else{
                    const result = await newsService.updateById(id,newsNew)
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
    
}

export default new newsController()
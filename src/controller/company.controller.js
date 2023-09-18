import companyService from "../service/company.service";
import deepEqual from "deep-equal";
class companyController{
    async create(req, res) {
        try {
            const image = !!req.file ? req.file.path.split('public')[1].replace(/\\/g, '/') : '';
            const data = {
                ...req.body,
                logo: image||undefined
            }
            const result = await companyService.create(data)
            !!result ? res.json({mes:'Thêm thành công', status:true}): res.json({mes:'Thêm không thành công', status:false})
        } catch (error) {
            console.log(error);
            res.status(500).json({error})
        }
    }

    async getCompany(req, res){
        try {
            const result = await companyService.find()
            res.json(result)
        } catch (error) {
            console.log(error);
            res.status(500).json({error})

        }
    }

    async update(req, res){
        try {
            const {id=undefined} = req.query

            if(!!id && !!req.body){
                const companyFindById= await companyService.findById(id)
                const companyOld = {
                    name:companyFindById.name,
                    taxCode:companyFindById.taxCode,
                    address:companyFindById.address,
                    phone:companyFindById.phone,
                    email:companyFindById.email,
                    president:companyFindById.president,
                    introduce:companyFindById.introduce,
                    logo:companyFindById.logo
                }
                const image = !!req.file ? req.file.path.split('public')[1].replace(/\\/g, '/') : companyFindById.logo;
                const companyNew= {
                    name:req.body.name,
                    taxCode:req.body.taxCode,
                    address:req.body.address,
                    phone:req.body.phone,
                    email:req.body.email,
                    president:req.body.president,
                    introduce:req.body.introduce,
                    logo:image
                }
                console.log(companyNew);
                console.log(companyOld);
                const isEqual = deepEqual(companyOld, companyNew)
                console.log(isEqual);
                if(isEqual || !!!req.body){
                    res.json({ mes: 'Chưa chỉnh sửa dữ liệu', status: false });
                }
                else{
                    const result = await companyService.updateById(id,companyNew)
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

export default new companyController()
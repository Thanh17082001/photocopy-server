import staffModel from "../model/staff.model";
import staffService from "../service/staff.service";
import userService from '../service/user.service'
import * as argon2 from 'argon2'
import deepEqual from "deep-equal";
class staffController{
    async create(req, res) {
      try {
        if(!!req.body){
            
            const exitEmail = await staffService.checkExit({email:req.body.email})
            const exitPhone = await staffService.checkExit({phone:req.body.phone})
            
            if(!!exitEmail || !!exitPhone){
                res.json({mes:'Email hoặc SĐT đã tồn tại', status:false})
                return;
            }
            else{
                let createAcount= undefined
                let userId=null
                //nhân viên đã có tài khoản
                if(req.body.account ==1){
                    const checkUserEmail = await userService.findByEmail(req.body.email)
                    if(!!checkUserEmail){
                        await userService.updateUserById(checkUserEmail._id, {isStaff:true})
                        userId=checkUserEmail._id
                    }
                    else{
                        res.json({mes:'Tài khoản chưa có trong hệ thống', status:true, data:createAcount})
                    }
                }

                // cấp tài khoản cho nhân viên
                else{
                    const data={
                        fullName:req.body.fullName,
                        email:req.body.email,
                        password: await argon2.hash(req.body.password),
                        phoneNumber:req.body.phone,
                        isStaff:true
                    }
                    createAcount= await userService.register(data)
                    userId=createAcount._id
                }
                //tạo nhan vien
                req.body.startDate=new Date(req.body.startDate)
                req.body.dateOfBirth=new Date(req.body.dateOfBirth)
                const avatar = !!req.file ? req.file.path.split('public')[1].replace(/\\/g, '/') : undefined;
                const data ={
                    idUser:userId,
                    ...req.body,
                    avatar
                }
                const createStaff=await staffService.create(data)
                if(!!createStaff){
                    if(!!createAcount){
                        res.json({mes:'Thêm nhân viên thành công ', status:true})
                    }
                    else{
                        res.json({mes:'Thêm nhân viên thành công và nâng cấp tài khoản lên TK nhân viên', status:true})
                    }
                }
                else{
                    res.json({mes:'Thêm thất bại', status:false})
                }
            }
        }
        else{
            res.json({mes:'Chưa nhập dữ liệu', status:false})
        }
      } catch (error) {
            console.log(error);
            res.status(500).json(error)
      }
    }

    async getAll(req, res){
        try {
            const {pageNumber=undefined} = req.query
            const {pageSize=undefined} = req.query
            const result = await staffService.find({},pageNumber,pageSize)
            res.json(result)
        } catch (error) {
            console.log(error);
            res.status(500).json(error)
        }
    }

    async update(req, res){
        try {
            const {id=undefined}=req.query
            if(!!!id || !!!req.body){
                res.json({mes:'Chưa truyền dữ liệu', status:false})
            }
            else{
                const staff = await staffService.findById(id)
                const oldStaff={
                    fullName: staff.fullName,
                    position: staff.position,
                    startDate: staff.startDate,
                    phone: staff.phone,
                    email: staff.email,
                    address: staff.address,
                    department: staff.department,
                    dateOfBirth: staff.dateOfBirth,
                    gender: staff.gender,
                    salary:staff.salary,
                    avatar:staff.avatar
                }
                req.body.startDate=new Date(req.body.startDate)
                req.body.dateOfBirth=new Date(req.body.dateOfBirth)
                const avatar = !!req.file ? req.file.path.split('public')[1].replace(/\\/g, '/') : undefined;
                const newStaff={
                    fullName: req.body.fullName,
                    position: req.body.position,
                    startDate: req.body.startDate,
                    phone: req.body.phone,
                    email: req.body.email,
                    address: req.body.address,
                    department: req.body.department,
                    dateOfBirth: req.body.dateOfBirth,
                    gender: req.body.gender,
                    salary:req.body.salary,
                    avatar: !!avatar ? avatar : staff.avatar
                }

                const isqual = deepEqual(oldStaff, newStaff)

                if(!isqual){
                    await staffService.update(id, newStaff)
                    res.json({mes:'Thay đổi thành công', status:true})
                }
                else{
                    res.json({mes:'Chưa chỉnh sửa dữ liệu', status:false})
                }
            }
        } catch (error) {
            console.log(error);
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
            const result = await staffService.findByDate(day,month,year,field,pageNumber,pageSize)
            res.json(result);
            
        } catch (error) {
            console.log(error);
        }
    }

    async getById(req, res){
        try {
            const {id=undefined}=req.query
            if(!!id){
                const result = await staffService.findById(id)
                res.json(result)
            }
        } catch (error) {
            console.log(error);
        }
    }
    
}

export default new staffController()
import userService from "../service/user.service";
import * as argon2 from "argon2";
import jwt  from "jsonwebtoken";
// Dang ky tai khoan
exports.register = async (req, res) => {
    try {
        req.body.password= await argon2.hash(req.body.password)
        const {email, password, phoneNumber, fullName} = req.body
        // check exist email and phone
        const existEmail = await userService.findByEmail(email)
        const existPhoneNumber = await userService.findByPhoneNumber(phoneNumber)
        if(!!existEmail || !!existPhoneNumber){
            res.status(400).json({mes:'tồn tại email hoặc số điện thoại'})
            return;
        }
        const data={
            fullName:fullName,
            email:email,
            password:password,
            phoneNumber:phoneNumber,
            isAdmin:true
        }
        const result = await userService.register(data)
        result ? res.status(200).json({mes:'Đăng ký thành công'}) : res.status(400).json({mes:'Đăng ký không thành công'})
    } catch (error) {
        res.status(500).json({error})
    }
}

exports.login = async (req, res)=> {
    try {
        const {email, password} = req.body
        const user = await userService.findByEmail(email)
        const verifyPass = !!user ? await argon2.verify(user.password, password): false
        if(verifyPass){
            const token = jwt.sign({userId: user._id,isAdmin:user.isAdmin, roles:user.roles},process.env.PRIVATE_KEY_TOKEN,{expiresIn:'6h'})
            req.session.auth = {
                token,
                ...user
            }
            // send token to client
            res.json(req.session.auth)
        }else{
            res.status(400).json({mes:'Đăng nhập không thành công sai mật khẩu hoặc tài khoản'})
        }
    } catch (error) {
        res.status(500).json({error})
    }
}
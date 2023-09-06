import userService from "../service/user.service";
import * as argon2 from "argon2";
import jwt  from "jsonwebtoken";
import mailer from "../utils/mailler"
import codeService from "../service/code.service";
import deepEqual from "deep-equal";
import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// Dang ky tai khoan
exports.register = async (req, res) => {
    try {
        req.body.password= await argon2.hash(req.body.password)
        const {email, password, phoneNumber, fullName} = req.body
        // check exist email and phone
        const existEmail = await userService.findByEmail(email)
        const existPhoneNumber = await userService.findByPhoneNumber(phoneNumber)
        if(!!existEmail || !!existPhoneNumber){
           res.json({mes:'Tồn tại email hoặc số điện thoại', status:false})
            return;
        }
        const data={
            fullName:fullName,
            email:email,
            password:password,
            phoneNumber:phoneNumber
        }
        const result = await userService.register(data)
        result ? res.json({mes:'Đăng ký thành công', status:true}) :res.json({mes:'Đăng ký không thành công', status:false})
    } catch (error) {
        res.status(500).json({error})
    }
}

// Dang nhap
exports.login = async (req, res)=> {
    try {
        if(!!!req.session.auth){
            const {email, password} = req.body
            const user = await userService.findByEmail(email)
            const verifyPass = !!user.password ? await argon2.verify(user.password, password): false
            if(verifyPass){
                const token = jwt.sign({userId: user._id,isAdmin:user.isAdmin, roles:user.roles},process.env.PRIVATE_KEY_TOKEN,{expiresIn:'6h'})
                req.session.auth = {
                    token,
                    user:{
                        ...user
                    }
                }
                // send token to client
                res.json({
                    mes:'Đăng nhập thành công',
                    status:true,
                    user:{
                        ...req.session.auth
                    }
                })
            }else{
                if(user.isGoogle){
                    return res.json({mes:'Tài khoản được đăng nhập bằng Google' , status: false})
                }
                res.json({mes:'Tài khoản hoặc mật khẩu không chính xác' , status: false})
            }
        }
        else{
            res.json({mes:'Bạn đã đăng nhập', status: false})
        }
    } catch (error) {
        res.status(500).json({error})
    }
}

// Dang nhap voi GG
exports.loginWithGoogle = async () =>{
        passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/user/google/callback"
          },
          async function(accessToken, refreshToken, profile, done) {
            let user = await userService.findByEmail(profile.emails[0].value)
            if(!!user){
                return done(null,user)
            }
            else{
                const data={
                    fullName: profile.displayName,
                    email:profile.emails[0].value,
                    phoneNumber:'',
                    avatar: profile.photos[0].value,
                    isGoogle:true
                }
                console.log(data);
                user = await userService.register(data)
                return done(null,user.toObject())
            }

          }
        ))
        passport.serializeUser(function(user, done) {
            done(null, {user:user});
          });
          
          passport.deserializeUser(function(user, done) {
            done(null, user);
          });
}

// Quen mat kha
exports.forgetPassWord = async (req, res) =>{
    try {
        const {email} = req.body
        const user = await userService.findByEmail(email)
        if(!!user){
            let numbers=''
            for (let i = 0; i < 6; i++) {
                let randomNumber = Math.floor(Math.random() * 10);
                numbers+=randomNumber;
            }
            const result = await mailer.sendMail(email , numbers, 'Mã Xác Nhận')
            if(!!result){
                await codeService.create({
                    emailUser:user.email,
                    codeNumber:numbers,
                    resetTokenExpires: Date.now() + 60000
                })
                res.json({status:true})
            }
            else {
                res.json({mes:'Lỗi khi gửi email',status:false}) 
            }
        }
        else{
           res.json({mes:'email không tồn tại',status:false})
        }
    } catch (error) {
        res.status(500).json({error})
    }
}

exports.confirmCode = async (req, res)=>{
    try {
        const {code, email} = req.body
        const codeConfirm = await codeService.findAllByEmail(email)
        if(codeConfirm.length !== 0){
            if(codeConfirm[0].codeNumber == code){
                await codeService.updateCodeIsValid(email, code)
                res.json({status:true})
            }
            else{
               res.json({status:false, mes:'Mã xác thực không chính xác'})
            }
 
        }
        else{
           res.json({mes:'Mã xác thực hết hạn hoặc đã được sử dụng', status:false})
        }
    } catch (error) {
        res.status(500).json({error})
    }
}

exports.resetPass=async (req, res)=>{
    try {
        if(!!req.body){
            const {email, password}=req.body
            if(!!email){
                const isVerifi= await codeService.getIValidByEmail(email)
                if(isVerifi.length !==0){
                    const newpassword = await argon2.hash(password)
                    await userService.updateByEmail(email, newpassword)
                    const a = await codeService.updateCodeUsed(email)
                    res.json({mes:'Đặt lại mật khẩu thành công', status:true})
                }
                else{
                    res.json({mes:'Email chưa xác thực', status:false})
                }
            }

        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
}


// Chinh sua thong tin
exports.updateUser = async (req, res) =>{
    try {
        const userLogin = req.session.auth 
        if(!!userLogin){
            const auth = {
                fullName: userLogin.fullName,
                email: userLogin.email,
                avatar: userLogin.avatar,
                phoneNumber: userLogin.phoneNumber
            }
            const image= !!req.file ? req.file.path.split('public')[1].replace(/\\/g, '/') : userLogin.image;
            const userChange ={
                fullName: req.body.fullName,
                email: req.body.email,
                avatar: image,
                phoneNumber: req.body.phoneNumber
            }
            const isEqual= deepEqual(auth,userChange)
            if(!isEqual){
                const existEmail = await userService.checkExistEmail(userLogin._id,req.body.email)
                const existPhoneNumber = await userService.checkExistPhoneNumber(userLogin._id,req.body.phoneNumber)
                if(existEmail){
                    res.json({mes:'Email đã được sử dụng', status: false})
                }
                else if(existPhoneNumber){
                    res.json({mes:'Số điện thoại đã được sử dụng', status: false})
                }
                else{
                    await userService.updateUserById(userLogin._id, userChange)
                    res.json({mes:'Thay đổi thông tin thành công', status:true})
                }
            }
            else{
                res.json({mes:'Không có sự thay đổi', status: false});
            }
        }
        else{
            res.json({mes:'Bạn chưa đăng nhập'})
        }
    } catch (error) {
        res.status(500).json({error})
    }
}

// Doi mat khau
exports.changePassword = async (req, res) => {
    try {
        const auth = req.session.auth
        if(!!auth){
            const user = await userService.findByEmail(auth.email)
            const {password, newPassword} = req.body
            const verify = await argon2.verify(user.password, password)
            if(verify){
                const password = await argon2.hash(newPassword)
                await userService.updateUserById(user._id,{password})
                res.json({mes:'Đổi mật khẩu thành công', status:true})
            }
            else{
                res.json({mes:'Mật khẩu cũ không chính xác', status: false})
            }
        }
        else{
            res.json({mes:'Bạn chưa đăng nhập'})
        }
    } catch (error) {
        
    }
}

// Dang xuat
exports.logout = (req, res) =>{
    req.session.auth=undefined
    res.json({mes:'Đăng xuất thành công', status:true})
}
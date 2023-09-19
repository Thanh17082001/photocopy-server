import  express  from "express";
import passport from "passport";
import jwt  from "jsonwebtoken";
import UserController from '../controller/user.controller'
import upload from '../utils/multer'

const route = express.Router()
route.post('/register',UserController.register )
route.post('/login',UserController.login )
route.post('/forget',UserController.forgetPassWord)
route.post('/confirm-pass',UserController.confirmCode)
route.post('/reset-pass',UserController.resetPass)
route.post('/update',  upload('users').single('image'),UserController.updateUser)
route.post('/change-pass',UserController.changePassword)
route.get('/logout',UserController.logout)
route.post('/disable/:id', UserController.disable)
route.post('/update-role/', UserController.updateRole) //?id=
//login with google
UserController.loginWithGoogle()
function isLogged(req, res, next){
    if(req.user){
        const user=req.user
        const token = jwt.sign({userId: user._id,isAdmin:user.isAdmin, roles:user.roles},process.env.PRIVATE_KEY_TOKEN,{expiresIn:'6h'})
        req.session.auth = {
            token,
            user:{
                ...user
            }
        }
        next()
    }else{
        res.send('lỗi đăng nhập')
    }
}

route.get('/google', passport.authenticate('google', { scope: ['profile', 'email']}))
route.get('/google/callback', passport.authenticate('google', { failureRedirect:'/home'}), isLogged,(req , res)=>{
    res.redirect(`http://localhost:3001`);
})
route.get('/info-user',(req, res)=>{
    if(!!req.session.auth){
        res.json(req.session.auth)
    }
    else{
        res.json({})
    }
})
route.get('/filter-date',UserController.filterByFullDate)
route.get('/', UserController.getAll)
export default route
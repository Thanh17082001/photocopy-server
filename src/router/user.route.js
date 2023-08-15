import  express  from "express";
import passport from "passport";
import jwt  from "jsonwebtoken";
import UserController from '../controller/user.controller'
const route = express.Router()
route.post('/register',UserController.register )
route.post('/login',UserController.login )
route.post('/forget',UserController.forgetPassWord)
route.post('/confirm-pass',UserController.confirmCode)
route.post('/update',UserController.updateUser)
route.post('/change-pass',UserController.changePassword)
route.get('/logout',UserController.logout)
//login with google
UserController.loginWithGoogle()
function isLogged(req, res, next){
    if(req.user){
        const user=req.user
        const token = jwt.sign({userId: user._id,isAdmin:user.isAdmin, roles:user.roles},process.env.PRIVATE_KEY_TOKEN,{expiresIn:'6h'})
        req.session.auth = {
            token,
            ...user
        }
        next()
    }else{
        res.send('lỗi đăng nhập')
    }
}

route.get('/google', passport.authenticate('google', { scope: ['profile', 'email']}))
route.get('/google/callback', passport.authenticate('google', { failureRedirect:'/home'}), isLogged,(req , res)=>{
   // chuyển hướng về vue
   console.log(req.session.auth);
    res.redirect(`http://localhost:3000`);
})

export default route
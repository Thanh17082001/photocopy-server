import  express  from "express";
import UserController from '../controller/user.controller'
const route = express.Router()

route.post('/register',UserController.register )
route.post('/login',UserController.login )
route.post('/forget',UserController.forgetPassWord)
route.post('/confirm-pass',UserController.confirmCode)
route.post('/update',UserController.updateUser)
route.post('/change-pass',UserController.changePassword)
route.get('/logout',UserController.logout)

export default route
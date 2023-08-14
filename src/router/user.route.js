import  express  from "express";
import UserController from '../controller/user.controller'
const route = express.Router()

route.post('/register',UserController.register )
route.post('/login',UserController.login )

export default route
import express from 'express'
import cartController from "../controller/cart.controller";

const route = express.Router()
route.post('/create',  cartController.create)
route.post('/update',cartController.updateQuantity)
route.post('/delete',cartController.delete)
route.get('/user',cartController.getByUserId)
route.get('/',cartController.getAll)

export default route;
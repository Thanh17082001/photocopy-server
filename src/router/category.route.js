import express from 'express'
import categoryController from "../controller/category.controller";

const route = express.Router()

route.post('/create', categoryController.create)
route.get('/',categoryController.getAll)

export default route;
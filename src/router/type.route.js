import express from 'express'
import typeController from "../controller/type.controller";

const route = express.Router()

route.post('/create', typeController.create)
route.get('/',typeController.getAll)

export default route;
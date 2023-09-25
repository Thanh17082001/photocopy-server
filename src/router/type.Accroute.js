import express from 'express'
import typeAccController from "../controller/typeAcc.controller";

const route = express.Router()

route.post('/create', typeAccController.create)
route.get('/',typeAccController.getAll)

export default route;
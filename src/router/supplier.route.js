import express from 'express'
import supplierController from '../controller/supplier.controller'
const router = express.Router()

router.post('/create',supplierController.create)
router.get('/',supplierController.getAll)

export default router
import express from 'express'
import specificationsController from '../controller/specifications.controller'
const router = express.Router()

router.post('/create', specificationsController.create) //?idproduct=
router.get('/product', specificationsController.getByIdProduct) // ?idProduct
router.post('/update', specificationsController.update) //?id=

export default router
import express from 'express'
import customerController from '../controller/customer.controller'

const router = express.Router()

router.post('/create',customerController.create)
router.get('/find',customerController.getById) // ?id=
router.post('/update',customerController.update) //?id
router.get('/',customerController.getAll)

export default router
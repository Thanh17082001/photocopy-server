import express from 'express'
import roleController from '../controller/role.controller'

const router = express.Router()

router.post('/create',roleController.create)
router.get('/find',roleController.getById) // ?id=
router.post('/update',roleController.update) //?id
router.get('/',roleController.getAll)

export default router
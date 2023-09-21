import express from 'express'
import staffController from '../controller/staff.controller'
import upload from '../utils/multer'


const router = express.Router()

router.post('/create',upload('staff').single('avatar'),staffController.create)
router.post('/update',upload('staff').single('avatar'),staffController.update) //?id
router.get('/filter-date', staffController.filterByFullDate) // ?day month year field
router.get('/find',staffController.getById) //?id
router.get('/',staffController.getAll) //?pageNumber pageSize 

export default router
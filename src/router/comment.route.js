import express from 'express'
import commentController from '../controller/commentController'
import upload from '../utils/multer'
const router = express.Router()

router.post('/create',upload('comments').single('image'), commentController.create) //?idproduct=
router.post('/product-id', commentController.getByIdProduct) // ?idProduct
router.post('/update', commentController.update) //?id=
router.get('/find',commentController.getById) // ?id=
router.get('/filter-date',commentController.filterByFullDate)
router.get('/',commentController.getAll)


export default router
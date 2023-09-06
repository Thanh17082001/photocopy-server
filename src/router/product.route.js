import express from 'express'
import productController from '../controller/product.controller'
import upload from '../utils/multer'

const router = express.Router()
router.post('/create', upload('products').single('image'),productController.create) 
router.post('/update', upload('products').single('image'),productController.update) //?id=
router.post('/search',productController.search)
router.get('/delete',productController.delete) //?id=
// router.get('/sort',productController.sortProduct) //?type= & field=
router.get('/get-id/', productController.getProductById) //?id=
router.get('/product-detail/', productController.getProductDetail) //?id=
router.get('/get-brand-id/', productController.getProductByBrandId) //?brandId=
router.get('/', productController.getAllProduct)  //?pageNumber&pageSize

export default router
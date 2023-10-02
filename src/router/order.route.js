import express from 'express'
import orderController from '../controller/order.controller'

const router = express.Router()

router.post('/create',orderController.create)
router.get('/find',orderController.getById) // ?id=
router.post('/update',orderController.update) //?id
router.post('/create_payment_url', orderController.vnpayPayment );
router.get('/payment',orderController.paymentReturn)
router.get('/filter-date',orderController.filterByFullDate)
router.get('/',orderController.getAll)

// Vui lòng tham khảo thêm tại code demo
export default router
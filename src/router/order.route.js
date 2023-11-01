import express from 'express'
import orderController from '../controller/order.controller'

const router = express.Router()

router.post('/create',orderController.create)
router.get('/find',orderController.getById) // ?id=
router.post('/update',orderController.update) //?id
router.post('/create_payment_url', orderController.vnpayPayment );
router.get('/payment',orderController.paymentReturn)
router.post('/search',orderController.searchOrder)
router.get('/filter-date',orderController.filterByFullDate)
router.post('/pay-momo', orderController.paymetnWithMoMO)
router.get('/pay-momo-return', orderController.returnMomo)

router.post('/sendMail',orderController.sendMail)
router.post('/confirm',orderController.confirm)
router.get('/',orderController.getAll)

// Vui lòng tham khảo thêm tại code demo
export default router
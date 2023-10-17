import express from 'express'
import warrantyController from '../controller/warranty.controller'

const router = express.Router()

router.post('/create',warrantyController.create)
router.get('/find',warrantyController.getById) // ?id=
router.post('/update',warrantyController.update) //?id
router.post('/create_payment_url', warrantyController.vnpayPayment );
router.get('/payment',warrantyController.paymentReturn)
router.get('/filter-date',warrantyController.filterByFullDate)
router.post('/pay-momo', warrantyController.paymetnWithMoMO)
router.get('/pay-momo-return', warrantyController.returnMomo)
router.get('/',warrantyController.getAll)

// Vui lòng tham khảo thêm tại code demo
export default router
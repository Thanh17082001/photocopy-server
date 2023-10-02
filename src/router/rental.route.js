import express from 'express'
import rentalController from '../controller/rental.controller'

const router = express.Router()

router.post('/create',rentalController.create)
router.get('/find',rentalController.getById) // ?id=
router.post('/update',rentalController.update) //?id
router.post('/create_payment_url', rentalController.vnpayPayment);
router.get('/payment',rentalController.paymentReturn)
router.get('/filter-date',rentalController.filterByFullDate)
router.get('/',rentalController.getAll)

// Vui lòng tham khảo thêm tại code demo
export default router
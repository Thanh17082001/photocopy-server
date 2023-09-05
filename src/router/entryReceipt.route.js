import express from 'express'
import entryReceiptController from '../controller/entryReceipt.controller';

const router = express.Router()

router.post('/create', entryReceiptController.create)
router.get('/entry-id/', entryReceiptController.getByIdEntry) // ?id=
router.get('/', entryReceiptController.getEntry)
export default router;
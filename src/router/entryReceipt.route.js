import express from 'express'
import entryReceiptController from '../controller/entryReceipt.controller';
// import upload from '../utils/multer'
import upload from '../utils/multer2';
const router = express.Router()

// router.post('/create', upload('entryReceipt').single('image') , entryReceiptController.create)
router.post('/create',  upload.single('image') , entryReceiptController.create)
router.get('/entry-id/', entryReceiptController.getByIdEntry) // ?id=
router.get('/', entryReceiptController.getEntry)
router.get('/update', entryReceiptController.update)
router.get('/filter-date',entryReceiptController.filterByFullDate)
export default router;
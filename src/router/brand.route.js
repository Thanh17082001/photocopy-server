import express from 'express'
import brandController from "../controller/brand.controller";
import upload from '../utils/multer';
// import upload from '../utils/multer2';

const route = express.Router()
// route.post('/create', upload.single('image'), brandController.create)
route.post('/create', upload('brands').single('image'), brandController.create)
route.post('/update',upload('brands').single('image'),brandController.update)
route.post('/delete',brandController.delete)
route.get('/',brandController.getAll)

export default route;
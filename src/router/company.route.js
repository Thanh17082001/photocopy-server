import express from "express";
import companyController from "../controller/company.controller";
import upload from "../utils/multer";

const router = express.Router()
router.post('/create',upload('logo').single('image'),companyController.create )
router.post('/update',upload('logo').single('image'),companyController.update )
router.get('/', companyController.getCompany)
export default router;
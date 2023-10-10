import express from "express";
import serviceController from "../controller/service.controller";
import upload from "../utils/multer";

const router = express.Router()
router.post('/create',serviceController.create )
router.post('/update',serviceController.update )
router.get('/find',serviceController.getById)
router.get('/delete',serviceController.delete) // id=
router.get('/filter-date',serviceController.filterByFullDate)
router.get('/', serviceController.getAll)
export default router;
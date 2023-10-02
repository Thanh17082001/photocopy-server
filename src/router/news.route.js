import express from "express";
import newsController from "../controller/news.contronller";
import upload from "../utils/multer";

const router = express.Router()
router.post('/create',upload('news').single('image'),newsController.create )
router.post('/update',upload('news').single('image'),newsController.update )
router.get('/find',newsController.getById)
router.get('/', newsController.getAll)
export default router;
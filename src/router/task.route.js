import express from "express";
import taskController from "../controller/task.controller";
import upload from '../utils/multer';
const router = express.Router()
router.post('/create',taskController.create )
router.post('/update',taskController.update )
router.post('/report',upload('tasks').single('image'),taskController.report )
router.post('/update-status',taskController.updateStatus)
router.get('/find',taskController.getById)
router.get('/delete',taskController.delete) // id=
router.get('/filter-date',taskController.filterByFullDate)
router.get('/', taskController.getAll)
export default router;
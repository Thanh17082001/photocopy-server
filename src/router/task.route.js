import express from "express";
import taskController from "../controller/task.controller";

const router = express.Router()
router.post('/create',taskController.create )
router.post('/update',taskController.update )
router.post('/update-status',taskController.updateStatus)
router.get('/find',taskController.getById)
router.get('/delete',taskController.delete) // id=
router.get('/filter-date',taskController.filterByFullDate)
router.get('/', taskController.getAll)
export default router;
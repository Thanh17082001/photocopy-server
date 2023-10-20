import siteController from "../controller/site.controller";
import express from 'express'

const router= express.Router()
router.get('/revenue-year',siteController.revenueYear) // ?year
router.get('/revenue-month',siteController.revenueMonth) // ?year&&month
export default router
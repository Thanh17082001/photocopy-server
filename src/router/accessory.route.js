import express from 'express'
import accessoryController from '../controller/accessory.controller';
import upload from '../utils/multer';

const route = express.Router()
route.post('/create', upload('accessory').single('image'), accessoryController.create)
route.post('/update',upload('accessory').single('image'),accessoryController.update) // ?id=
route.get('/find',accessoryController.getById) // ?id=
route.get('/filter-date', accessoryController.filterByFullDate)  // ?day month year field
route.get('/filter',accessoryController.filterProduct) //?type= & field=
route.get('/',accessoryController.getAllAccessory)//?pageNumber &pageSize

export default route;
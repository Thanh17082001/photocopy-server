import userRoute  from "./user.route";
import brandRoute from "./brand.route"
import categoryRoute from "./category.route"
import productRoute from "./product.route"
import specificationsRoute from "./specifications.route"
import entryReceiptRoute from "./entryReceipt.route"
import supplierRoute from './supplier.route'
const routers = (app)=> {
    app.use('/user',userRoute)
    app.use('/brand',brandRoute)
    app.use('/category',categoryRoute)
    app.use('/product',productRoute)
    app.use('/spacification',specificationsRoute)
    app.use('/entry-receipt', entryReceiptRoute)
    app.use('/supplier', supplierRoute)
    app.use('/',(req, res)=>{
        res.send('Hom page')
    })
}

export default routers;
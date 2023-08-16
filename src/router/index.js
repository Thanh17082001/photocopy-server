import userRoute  from "./user.route";
import brandRoute from "./brand.route"
import productRoute from "./product.route"
const routers = (app)=> {
    app.use('/user',userRoute)
    app.use('/brand',brandRoute)
    app.use('/product',productRoute)
    app.use('/',(req, res)=>{
        res.send('Hom page')
    })
}

export default routers;
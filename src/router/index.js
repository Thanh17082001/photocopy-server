import userRouter  from "./user.route";

const routers = (app)=> {
    app.use('/user',userRouter)
    app.use('/',(req, res)=>{
        res.send('Hom page')
    })
}

export default routers;
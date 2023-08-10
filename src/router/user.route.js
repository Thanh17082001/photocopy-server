import  express  from "express";

const route = express.Router()

route.get('/', (req, res)=>{
    res.json({mgs:'User'})
})

export default route
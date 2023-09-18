import mongoose from "mongoose";
import { Schema } from "mongoose";

const companySchema = new Schema({
    name:String,
    taxCode:String,
    address:String,
    phone:String,
    email:String,
    president:String,
    introduce:String,
    logo:{
        type:String,
        default:'/logo/logo.jpg'
    }
},{timestamps:true})

export default mongoose.model('company', companySchema)
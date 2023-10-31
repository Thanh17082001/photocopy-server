import mongoose from "mongoose";
import { Schema } from "mongoose";

const customerSchema = new Schema({
    fullName:String,
    address:String,
    phone:String,
    email:{
        type:String,
        default: ''
    }
}, {timestamps:true})

export default mongoose.model('customer',customerSchema)
import mongoose from "mongoose";
import { Schema } from "mongoose";

const customerSchema = new Schema({
    fullname:String,
    address:String,
    phone:String,
    email:String,
}, {timestamps:true})

export default mongoose.model('customer',customerSchema)
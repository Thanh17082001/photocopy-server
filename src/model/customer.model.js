import mongoose from "mongoose";
import { Schema } from "mongoose";

const customerSchema = new Schema({
    fullName:String,
    address:String,
    phone:String,
}, {timestamps:true})

export default mongoose.model('customer',customerSchema)
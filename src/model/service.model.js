import mongoose from "mongoose";
import { Schema } from "mongoose";

const serviceSchema = new Schema({
    name:String,
    price:Number
},{timestamps:true})

export default mongoose.model('service',serviceSchema)
import mongoose from "mongoose";
import { Schema } from "mongoose";

const serviceSchema = new Schema({
    name:String,
    description:String,
},{timestamps:true})

export default mongoose.model('service',serviceSchema)
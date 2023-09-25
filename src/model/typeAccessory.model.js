import mongoose from "mongoose";
import { Schema } from "mongoose";

const typeAccSchema = new Schema({
    name:String
},{timestamps:true})

export default mongoose.model('type-accessory', typeAccSchema)
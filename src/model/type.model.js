import mongoose from "mongoose";
import { Schema } from "mongoose";

const typeSchema = new Schema({
    name:String
},{timestamps:true})

export default mongoose.model('type', typeSchema)
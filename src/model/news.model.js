import mongoose from "mongoose";
import { Schema } from "mongoose";

const newsSchema = new Schema({
    title:String,
    content:String,
    image:String
}, {timestamps:true})

export default mongoose.model('news', newsSchema)
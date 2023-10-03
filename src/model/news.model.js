import mongoose from "mongoose";
import { Schema } from "mongoose";

const newsSchema = new Schema({
    createBy:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    title:String,
    content:String,
    image:String,
}, {timestamps:true})

export default mongoose.model('news', newsSchema)
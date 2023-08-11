import mongoose from "mongoose";
import { Schema } from "mongoose";

const brandSchema = new Schema({
    name:{
        type: String
    },
    image:{
        type:String
    }
}, {timestamps:true})

export default mongoose.model('brand', brandSchema)
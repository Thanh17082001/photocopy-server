import mongoose from "mongoose";
import { Schema } from "mongoose";

const codeSchema = new Schema({
    codeNumber: {
        type: String,
        required: true
    },
    emailUser:{
        type:String, 
    },
    resetTokenExpires:{
        type:Date
    },
    used:{
        type:Boolean,
        default:false
    },
    isValid:{
        type:Boolean,
        default:false
    }
}, {timestamps:true})

export default mongoose.model('code', codeSchema);
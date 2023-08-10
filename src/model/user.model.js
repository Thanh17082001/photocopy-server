import mongoose from "mongoose";

import { Schema } from "mongoose";

const userShema = new Schema({
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
}, {timestamps:true})


export default mongoose.model('user', userShema)
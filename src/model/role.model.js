import mongoose, { model } from "mongoose";
import { Schema } from "mongoose";

const roleSchema = new Schema({
    roleName:{
        type:String
    }
}, {timestamps:true})

export default mongoose.model('role', roleSchema)
import mongoose from "mongoose";
import { Schema } from "mongoose";

const staffSchema = new Schema({
    fullName:String,
    position:String,
    startDate:{
        type:Date,
    },
    phone:String,
    email:String,
    address:String,
    department:String,
    dateOfBirth:Date,
    gender:{
        type:String,
        emun:['Nam', 'Nữ']
    },
    salary:Number
}, {timestamps: true})

export default mongoose.model('staff', staffSchema)
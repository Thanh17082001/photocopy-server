import mongoose from "mongoose";
import { Schema } from "mongoose";

const staffSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    fullName:{
        type:String,
        default:''
    },
    position:{
        type:String,
        default:''
    },
    startDate:{
        type:Date,
    },
    phone:{
        type:String,
        default:''
    },
    email:{
        type:String,
        default:''
    },
    address:{
        type:String,
        default:''
    },
    department:{
        type:String,
        default:''
    },
    dateOfBirth:{
        type:Date,
        default:''
    },
    gender:{
        type:String,
        emun:['Nam', 'Nữ']
    },
    salary:{
        type:Number,
        default:0
    }
}, {timestamps: true})

export default mongoose.model('staff', staffSchema)
import mongoose from "mongoose";

import { Schema } from "mongoose";

const userShema = new Schema({
    fullName: String,
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
    },
    isAdmin:{
        type:Boolean,
        default:false
    }, 
    avatar:{
        type:String,
        default:'/users/avt-default.jpg'
    },
    roles:[
        {
            type:Schema.Types.ObjectId,
            ref: 'role'
        }
    ],
    phoneNumber:{
        type:String
    },
    isGoogle:{
        type:Boolean,
        default:false
    },
    isStaff:{
        type:Boolean,
        default:false
    },
    disable:{
        type:Boolean,
        default:false
    }
}, {timestamps:true})


export default mongoose.model('user', userShema)
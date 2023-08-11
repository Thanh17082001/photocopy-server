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
    }, 
    avatar:{
        type:String,
    },
    role:[
        {
            roleId:{
                type:Schema.Types.ObjectId,
                ref: 'role'
            }
        }
    ],
    phoneNumber:{
        type:String
    },
    
}, {timestamps:true})


export default mongoose.model('user', userShema)
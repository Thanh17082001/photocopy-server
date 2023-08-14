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
        require:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    }, 
    avatar:{
        type:String,
        default:'https://phongreviews.com/wp-content/uploads/2022/11/avatar-facebook-mac-dinh-8.jpg'
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
    
}, {timestamps:true})


export default mongoose.model('user', userShema)
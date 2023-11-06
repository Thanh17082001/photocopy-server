import mongoose from "mongoose";
import { Schema } from "mongoose";

const commentSchema = new Schema({
    email:String,
    name:String,
    productId:{
        type:Schema.Types.ObjectId,
        refPath:'typeProduct',
    },
    typeProduct:String,
    content:{
        type:String
    },
    rate:{
        type:Number,
        emum:[1,2,3,4,5],
    },
    image:String,
    approve:{
        type:Boolean,
        default:false
    },
    feedback:[
        {
            userFeedbackId:{
                type:Schema.Types.ObjectId,
                ref:'user'
            },
            contentFeedback:String
        }
    ]

}, {timestamps:true})

export default mongoose.model('comment', commentSchema)
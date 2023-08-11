import mongoose from "mongoose";
import { Schema } from "mongoose";

const commentSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    productId:{
        type:Schema.Types.ObjectId,
        ref:'product'
    },
    content:{
        type:String
    },
    rate:{
        type:Number,
        emum:[0,1,2,3,4,5],
        default:0
    },
    image:String,
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
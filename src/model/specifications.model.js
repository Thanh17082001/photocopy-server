import mongoose from "mongoose";
import { Schema } from "mongoose";

const specificationsSchema = new Schema ({
    idProduct:{
        type: Schema.Types.ObjectId,
        ref: 'product'
    },
    speed:{
        type:String
    },
    paperSize:{
        type:String
    },
    paperTray:{
        type:String
    },
    connectionTechnology:{
        type:String,
        default:''
    },
    screen:{
        type:String
    }
}, {timestamps: true})

export default mongoose.model('specifications', specificationsSchema)
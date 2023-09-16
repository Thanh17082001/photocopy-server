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
    },
    screen:{
        type:String
    },
    screenResolution:String,
    ramMemory:String,
    hardDrive:String,
    bootTime:String,
    zoom:String,
    continuously:String,
    connector:String,
    operatingSystem:String,
    electricUsed:String,
    wattage:String,
    weight:String


}, {timestamps: true})

export default mongoose.model('specifications', specificationsSchema)
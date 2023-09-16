import mongoose from "mongoose";
import { Schema } from "mongoose";

const supplierSchema= new Schema({
    name:String,
    address:String,
    phone:String,
},{timestamps:true});

export default mongoose.model('supplier', supplierSchema)
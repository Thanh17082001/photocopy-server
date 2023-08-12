import mongoose from "mongoose";
import { Schema } from "mongoose";

const customerSchema = new Schema({
    fullname:String,
    address:String,
    phoneNumber:String,
    email:String
}, {timestamps:true})
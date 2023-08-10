import mongoose from 'mongoose';

async function  connectToDb(){
    try {
        await mongoose.connect('mongodb://127.0.0.1/photocopy');
        console.log('connect database successfully !');
    } catch (error) {
        console.log("connect failed with error: ", error);
    }
}

export default connectToDb;
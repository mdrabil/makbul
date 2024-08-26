import mongoose from "mongoose";

const usershema = new mongoose.Schema({
    name:{
        type :String
    },
    email:{
        type:String
    },
    password:{
        type:String
    }
})

const User = mongoose.model("users",usershema)
export default User
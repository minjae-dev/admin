import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({

name:String,
email:String,
status:{
type:String,
default:"pending"
},

createdAt:{
type:Date,
default:Date.now
}

})

export default mongoose.models.User ||
mongoose.model("User",UserSchema)
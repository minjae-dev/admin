import { connectDB } from "../../../lib/mongodb"
import User from "../../../models/User"

export default async function handler(req,res){

await connectDB()

const {id} = req.query

if(req.method==="PUT"){

const user = await User.findByIdAndUpdate(id,{
status:"approved"
})

res.json(user)

}

if(req.method==="DELETE"){

await User.findByIdAndDelete(id)

res.json({success:true})

}

}
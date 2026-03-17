import { connectDB } from "../../../lib/mongodb"
import User from "../../../models/User"

export default async function handler(req,res){

await connectDB()

if(req.method==="GET"){

const users = await User.find()

res.json(users)

}

if(req.method==="POST"){

const user = await User.create(req.body)

res.json(user)

}

}
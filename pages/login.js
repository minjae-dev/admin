import { useState } from "react"
import { useRouter } from "next/router"

export default function Login(){

const router = useRouter()

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")

const login = () => {

if(email === "admin@test.com" && password === "123456"){

localStorage.setItem("admin","true")
router.push("/dashboard")

}else{

alert("Wrong account")

}

}

return(

<div className="flex items-center justify-center h-screen bg-gray-100">

<div className="bg-white p-8 shadow rounded w-80">

<h1 className="text-xl font-bold mb-4">Admin Login</h1>

<input
className="border p-2 w-full mb-3"
placeholder="email"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
className="border p-2 w-full mb-4"
placeholder="password"
onChange={(e)=>setPassword(e.target.value)}
/>

<button
className="bg-blue-500 text-white w-full p-2 rounded"
onClick={login}
>
Login
</button>

</div>

</div>

)

}
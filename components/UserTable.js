import { useEffect, useState } from "react"

export default function UserTable(){

const [users,setUsers] = useState([])

const loadUsers = async()=>{

const res = await fetch("/api/users")
const data = await res.json()

setUsers(data)

}

useEffect(()=>{

loadUsers()

},[])

const approveUser = async(id)=>{

await fetch("/api/users/"+id,{
method:"PUT"
})

loadUsers()

}

const deleteUser = async(id)=>{

await fetch("/api/users/"+id,{
method:"DELETE"
})

loadUsers()

}

return(

<table className="w-full bg-white shadow rounded">

<thead>

<tr className="bg-gray-100">
<th>Name</th>
<th>Email</th>
<th>Status</th>
<th>Action</th>
</tr>

</thead>

<tbody>

{users.map(user=>(

<tr key={user._id} className="border-t">

<td className="p-3">{user.name}</td>
<td>{user.email}</td>
<td>{user.status}</td>

<td className="space-x-2">

<button
className="bg-green-500 text-white px-3 py-1"
onClick={()=>approveUser(user._id)}
>
Approve
</button>

<button
className="bg-red-500 text-white px-3 py-1"
onClick={()=>deleteUser(user._id)}
>
Delete
</button>

</td>

</tr>

))}

</tbody>

</table>

)

}
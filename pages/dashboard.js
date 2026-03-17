import ChartCard from "../components/ChartCard"
import Sidebar from "../components/Sidebar"
import { users } from "../data/users"

export default function Dashboard(){

const total = users.length
const pending = users.filter(u=>u.status==="pending").length
const approved = users.filter(u=>u.status==="approved").length

return(

<div className="flex">

<Sidebar/>

<div className="p-10 w-full">

<h1 className="text-2xl font-bold mb-6">
Dashboard
</h1>

<div className="grid grid-cols-3 gap-6 mb-8">

<div className="bg-white p-6 shadow rounded">
Total Users
<h2 className="text-xl">{total}</h2>
</div>

<div className="bg-white p-6 shadow rounded">
Pending
<h2>{pending}</h2>
</div>

<div className="bg-white p-6 shadow rounded">
Approved
<h2>{approved}</h2>
</div>

</div>

<ChartCard/>

</div>

</div>

)

}
import Sidebar from "../components/Sidebar"
import UserTable from "../components/UserTable"

export default function Users(){

return(

<div className="flex">

<Sidebar/>

<div className="p-10 w-full">

<h1 className="text-2xl font-bold mb-6">
User Management
</h1>

<UserTable/>

</div>

</div>

)

}
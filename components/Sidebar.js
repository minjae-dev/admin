import Link from "next/link"

export default function Sidebar(){

return(

<div className="w-64 h-screen bg-gray-900 text-white p-6">

<h2 className="text-xl font-bold mb-8">
Admin Panel
</h2>

<ul className="space-y-4">

<li>
<Link href="/dashboard">
Dashboard
</Link>
</li>

<li>
<Link href="/users">
Users
</Link>
</li>

</ul>

</div>

)

}
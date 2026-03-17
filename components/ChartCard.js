import "chart.js/auto"
import { Bar } from "react-chartjs-2"

export default function ChartCard(){

const data = {

labels:["Jan","Feb","Mar","Apr"],

datasets:[

{
label:"New Users",
data:[3,5,2,8],
backgroundColor:"rgba(59,130,246,0.6)"
}

]

}

return(

<div className="bg-white p-6 shadow rounded">

<h2 className="mb-4 font-bold">
User Growth
</h2>

<Bar data={data} />

</div>

)

}
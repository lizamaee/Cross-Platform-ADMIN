import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import 'chart.js/auto';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ChartData {
    labels: string[],
    datasets: {
      label: string,
      data: number[],
      fill?: boolean,
      backgroundColor?: string,
      borderColor?: string,
      borderWidth?: number,
    }[],
  }

export default function LineChart({chartData}: {chartData: ChartData}) {
  return <Line data={chartData}/>
}

import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData, ChartOptions } from "chart.js";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

ChartJS.register([ArcElement, Tooltip, Legend]);

type LineChartProps = {
  options: ChartOptions<"line">,
  chartData: ChartData<"line", (number | null | undefined)[]>,
}

const LineChart = ({ chartData, options }: LineChartProps) => {
  return <Line data={chartData} options={options} />;
};

export default LineChart;

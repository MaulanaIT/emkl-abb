import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {

  return (
    <div className="active content overflow-auto">
      <p className="fw-bold text-secondary text-size-10">Dashboard</p>
      <div className="card-form p-4">
      </div>
    </div>
  )
}

export default Dashboard


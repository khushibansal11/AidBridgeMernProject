import React, { useEffect } from 'react'
import Sidebar from './AdminLayout/sidebar.js'
import { Chart, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import "./dashboard.css";
import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom";
import { Doughnut, Line } from "react-chartjs-2";
import { useSelector, useDispatch } from "react-redux";
import { getAllUsers } from "../../actions/userActions.js";

Chart.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {

    const dispatch = useDispatch();

  const { users } = useSelector((state) => state.allUsers);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const rolesCount = {
    Helper: 0,
    Seeker: 0,
    Admin: 0,
  };

  users &&
    users.forEach((user) => {
      if (rolesCount[user.role] !== undefined) {
        rolesCount[user.role] += 1;
      }
    });

    const doughnutState = {
        labels: ["Helper", "Seeker", "Admin"],
        datasets: [
          {
            backgroundColor: ["#00A6B4", "#6800B4", "#FF6384"],
            hoverBackgroundColor: ["#4B5000", "#35014F", "#FF6384"],
            data: [rolesCount.Helper, rolesCount.Seeker, rolesCount.Admin],
          },
        ],
      };

  // User creation over time for line chart
  const usersByDate = {};
  users &&
    users.forEach((user) => {
      const date = new Date(user.createdAt).toLocaleDateString();
      if (usersByDate[date]) {
        usersByDate[date] += 1;
      } else {
        usersByDate[date] = 1;
      }
    });

  // Calculate cumulative counts
  const dates = Object.keys(usersByDate).sort();
  const cumulativeCounts = [];
  let cumulativeCount = 0;

  dates.forEach((date) => {
    cumulativeCount += usersByDate[date];
    cumulativeCounts.push(cumulativeCount);
  });

  const lineState = {
    labels: dates,
    datasets: [
      {
        label: "Cumulative Number of Users",
        backgroundColor: ["tomato"],
        hoverBackgroundColor: ["rgb(197, 72, 49)"],
        data: cumulativeCounts,
      },
    ],
  };


  return (
    <div className='main'>
      <Sidebar/>

      <div className="dashboardContainer">
        <Typography component="h1" style={{fontSize: "42px",marginBottom: "16px"}}>Dashboard</Typography>

        <div className="dashboardSummary">
          <div className="dashboardSummaryBox2">
            <Link to="/admin/users">
              <p>Users</p>
              <p>{users && users.length}</p>
            </Link>
          </div>
        </div>

        <div className="lineChart">
          <Line data={lineState} />
        </div>

        <div className="doughnutChart">
          <Doughnut data={doughnutState} />
        </div>
      </div>

    </div>
  )
}

export default AdminDashboard

import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { FaCoffee, FaDollarSign, FaSyncAlt } from "react-icons/fa";
import "./DashboardLanding.css";

function DashboardLanding({ salesData }) {
  return (
    <div className="dashboard-summary">
      <h2 className="dashboard-title">Ecommerce Dashboard</h2>
      <p className="dashboard-subtitle">Here’s what’s going on at your business right now</p>
      <div className="stats-row">
        <div className="stat-item">
          <FaCoffee className="stat-icon" /> <strong>57 new orders</strong><br />Awaiting processing
        </div>
        <div className="stat-item">
          <FaSyncAlt className="stat-icon" /> <strong>5 orders</strong><br />On hold
        </div>
        <div className="stat-item">
          <FaDollarSign className="stat-icon" /> <strong>15 products</strong><br />Out of stock
        </div>
      </div>
      <h3 className="dashboard-subtitle">Total Sells</h3>
      <p className="dashboard-subtitle">Payment received across all channels</p>
      <div className="chart-container">
        <LineChart width={600} height={300} data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e8f0" />
          <XAxis dataKey="name" stroke="#4a90e2" />
          <YAxis stroke="#4a90e2" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="sales" stroke="#4a90e2" activeDot={{ r: 8 }} />
        </LineChart>
      </div>
      <div className="metrics-row">
        <div>Total orders <span className="metric-change">-6.8%</span><br />Last 7 days</div>
        <div><strong>16,247</strong></div>
        <div>New customers <span className="metric-change">+2.5%</span><br />Last 7 days</div>
      </div>
    </div>
  );
}

export default DashboardLanding;
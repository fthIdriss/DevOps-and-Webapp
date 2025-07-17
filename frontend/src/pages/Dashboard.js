import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import DashboardLanding from "./components/DashboardLanding";
import "./Dashboard.css";
import AddOrder from "./components/AddOrder";
import PlacedOrders from "./components/PlacedOrder";

function Dashboard() {
  const [salesData, setSalesData] = useState([
    { name: "01 Jul", sales: 1000 },
    { name: "05 Jul", sales: 1200 },
    { name: "10 Jul", sales: 1500 },
    { name: "15 Jul", sales: 1800 },
    { name: "20 Jul", sales: 1600 },
  ]);

  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get("/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrdersData(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: "#f0f4f8" }}>
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ marginLeft: "250px" }}>
        <div className="container-fluid">
          <div className="row mb-4">
            <div className="col-12">
              <div className="card dashboard-card">
                <div className="card-body">
                  <h5 className="card-title">Sales Overview</h5>
                  <DashboardLanding salesData={salesData} />
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-lg-8 col-md-10 mx-auto">
              <div className="card dashboard-card">
                <div className="card-body">
                  <h5 className="card-title">Add New Order</h5>
                  <AddOrder setOrdersData={setOrdersData} />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card dashboard-card">
                <div className="card-body">
                  <h5 className="card-title">Placed Orders</h5>
                  {loading ? (
                    <p>Loading orders...</p>
                  ) : error ? (
                    <p className="text-danger">{error}</p>
                  ) : (
                    <PlacedOrders ordersData={ordersData} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
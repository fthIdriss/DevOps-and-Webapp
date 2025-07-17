import React from "react";
import { FaClipboardList, FaPlus, FaBoxOpen, FaSignOutAlt } from "react-icons/fa";
import "./SideBar.css";

function Sidebar() {
  const handleSignOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h4 className="sidebar-title">☕ Coffee Dashboard</h4>
      </div>
      <nav className="sidebar-nav">
        <ul className="nav flex-column">
          <li className="nav-item">
            <button
              className="nav-link"
              onClick={() => scrollToSection("summary")}
            >
              <FaClipboardList className="nav-icon" /> Dashboard
            </button>
          </li>
          <li className="nav-item">
            <button
              className="nav-link"
              onClick={() => scrollToSection("add-order")}
            >
              <FaPlus className="nav-icon" /> Add Order
            </button>
          </li>
          <li className="nav-item">
            <button
              className="nav-link"
              onClick={() => scrollToSection("placed-orders")}
            >
              <FaBoxOpen className="nav-icon" /> Placed Orders
            </button>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button className="nav-link logout-btn" onClick={handleSignOut}>
          <FaSignOutAlt className="nav-icon" /> Sign Out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
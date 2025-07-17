import React, { useState } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import "./AddOrder.css";

function AddOrder({ setOrdersData }) {
  const [orderData, setOrderData] = useState({
    name: "",
    street: "",
    city: "",
    zip: "",
    lat: "",
    lng: "",
  });
  const [coffees, setCoffees] = useState([{ type: "", quantity: 1 }]);
  const coffeeOptions = ["Espresso", "Latte", "Cappuccino", "Americano", "Mocha"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "lat" || name === "lng") {
      if (value === "" || !isNaN(value)) {
        setOrderData({ ...orderData, [name]: value });
      }
    } else {
      setOrderData({ ...orderData, [name]: value });
    }
  };

  const handleCoffeeChange = (index, field, value) => {
    const updatedCoffees = [...coffees];
    updatedCoffees[index][field] = field === "quantity" ? parseInt(value) || 1 : value;
    setCoffees(updatedCoffees);
  };

  const addCoffeeField = () => {
    setCoffees([...coffees, { type: "", quantity: 1 }]);
  };

  const removeCoffeeField = (index) => {
    setCoffees(coffees.filter((_, i) => i !== index));
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    if (coffees.some((c) => !c.type || c.quantity < 1)) {
      alert("Please select a coffee type and a quantity of at least 1 for all entries.");
      return;
    }

    if (!orderData.lat || !orderData.lng || isNaN(orderData.lat) || isNaN(orderData.lng)) {
      alert("Please enter valid numeric values for latitude and longitude.");
      return;
    }

    if (!orderData.name || !orderData.street || !orderData.city || !orderData.zip) {
      alert("Please fill in all required fields (name, street, city, zip).");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not logged in. Please log in and try again.");
        return;
      }

      const newOrder = {
        ...orderData,
        coffee: coffees,
      };
      await axios.post("/api/orders", newOrder, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Commande envoyée !");
      setOrderData({ name: "", street: "", city: "", zip: "", lat: "", lng: "" });
      setCoffees([{ type: "", quantity: 1 }]);
      // Update ordersData with the new order (simulated for now)
      setOrdersData((prev) => [...prev, { ...newOrder, id: prev.length + 1, date: new Date().toISOString().split('T')[0] }]);
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Unknown error occurred";
      console.error("Error details:", err.response?.data);
      alert(`Erreur lors de l'envoi de la commande : ${errorMessage}`);
    }
  };

  return (
    <div className="add-order">
      <h3 className="add-order-title">Add Order</h3>
      <form onSubmit={handleOrderSubmit} className="order-form">
        <div className="row">
          <div className="col-md-6 mb-3">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Order Name"
              value={orderData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label">Coffee(s) Ordered</label>
            {coffees.map((c, index) => (
              <div key={index} className="row align-items-center mb-2">
                <div className="col-md-6">
                  <select
                    className="form-select"
                    value={c.type}
                    onChange={(e) => handleCoffeeChange(index, "type", e.target.value)}
                    required
                  >
                    <option value="">Select a type</option>
                    {coffeeOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    value={c.quantity}
                    onChange={(e) => handleCoffeeChange(index, "quantity", e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-2">
                  {index > 0 && (
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeCoffeeField(index)}
                    >
                      X
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-primary mt-2"
              onClick={addCoffeeField}
            >
              <FaPlus className="me-1" /> Add Coffee
            </button>
          </div>
          <div className="col-md-4 mb-3">
            <input
              type="text"
              name="street"
              className="form-control"
              placeholder="Street"
              value={orderData.street}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <input
              type="text"
              name="city"
              className="form-control"
              placeholder="City"
              value={orderData.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <input
              type="text"
              name="zip"
              className="form-control"
              placeholder="Zip Code"
              value={orderData.zip}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <input
              type="text"
              name="lat"
              className="form-control"
              placeholder="Latitude"
              value={orderData.lat}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <input
              type="text"
              name="lng"
              className="form-control"
              placeholder="Longitude"
              value={orderData.lng}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Submit Order
        </button>
      </form>
    </div>
  );
}

export default AddOrder;
import React from "react";
import "./PlacedOrder.css";

function PlacedOrders({ ordersData }) {
  return (
    <div className="placed-orders" id="placed-orders">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Coffee</th>
            <th>Quantity</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {ordersData.length > 0 ? (
            ordersData.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.name}</td>
                <td>
                {order.coffee?.map((c, i) => (
                    <div key={i}>{c.type}</div>
                ))}
                </td>
                <td>
                {order.coffee?.map((c, i) => (
                    <div key={i}>{c.quantity}</div>
                ))}
                </td>

                <td>{order.date}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No orders placed yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PlacedOrders;
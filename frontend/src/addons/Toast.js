import React, { useEffect, useState } from "react";

export default function Toast({ message, show, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer;
    if (show) {
      setVisible(true);
      timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 500); // wait for animation before calling onClose
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [show, onClose]);

  return (
    <div
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        backgroundColor: "#0d6efd",
        color: "white",
        padding: "12px 18px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        zIndex: 9999,
        transform: visible ? "translateX(0)" : "translateX(120%)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.5s ease, opacity 0.5s ease",
        pointerEvents: "none", // makes it unclickable so it doesn't interfere
      }}
    >
      {message}
    </div>
  );
}

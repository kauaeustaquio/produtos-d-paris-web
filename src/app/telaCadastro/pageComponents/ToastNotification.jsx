"use client";

import { useEffect } from "react";

export default function ToastNotification({ message, duration = 7000, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="toast-container">
      <div className="toast">
        <p>{message}</p>
        <div
          className="toast-progress"
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    </div>
  );
}

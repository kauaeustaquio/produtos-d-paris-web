"use client";

import { useEffect, useState } from "react";
import "./ToastNotification.css"; // vamos criar o CSS separado

export default function ToastNotification({
  type = "success",   // "success" ou "error"
  message = "",       // mensagem a ser exibida
  duration = 5000     // tempo em ms que fica na tela
}) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!message) return;

    setVisible(true);
    setProgress(100);

    const interval = 50;
    const decrement = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev - decrement <= 0) {
          clearInterval(timer);
          setVisible(false);
          return 0;
        }
        return prev - decrement;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [message, duration]);

  if (!visible) return null;

  return (
    <div className={`toast-notification ${type}`}>
      <div className="toast-message">{message}</div>
      <div className="toast-progress" style={{ width: `${progress}%` }}></div>
    </div>
  );
}

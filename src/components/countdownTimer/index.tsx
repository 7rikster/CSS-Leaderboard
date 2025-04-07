"use client";

import { useEffect, useState } from "react";

function CountdownTimer() {
  const targetDate = new Date("2025-04-11T23:59:59"); // EOD 12 April 2025

  const [timeLeft, setTimeLeft] = useState(targetDate.getTime() - Date.now());
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsTimeUp(true);
      return;
    }

    const interval = setInterval(() => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) {
        clearInterval(interval);
        setIsTimeUp(true);
      } else {
        setTimeLeft(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <>
      {!isTimeUp ? (
        <div className="text-4xl font-semibold mb-4">
          Time left: {formatTime(timeLeft)}
        </div>
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl text-center shadow-lg">
            <h2 className="text-2xl font-bold mb-4">🎉 Contest has ended!</h2>
            <button
              onClick={() => (window.location.href = "/results")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              View Results
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default CountdownTimer;

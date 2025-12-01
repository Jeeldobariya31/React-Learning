import React, { useState, useEffect } from "react";

function UseEffectDemo() {
  const [count, setCount] = useState(0);
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => {
    setLogs((prev) => [...prev, msg]);
  };

  // 🟢 1. Runs ONCE on component mount
  useEffect(() => {
    addLog("⏳ Component Mounted!");

    return () => {
      addLog("❌ Component Unmounted (Cleanup)");
    };
  }, []);

  // 🔵 2. Runs whenever count changes
  useEffect(() => {
    addLog("🔄 Count changed: " + count);
  }, [count]);

  return (
    <div>
      <h2>⚛️ useEffect Demo</h2>
      <h3>Count: {count}</h3>

      <button onClick={() => setCount(count + 1)}>➕ Increase</button>

      <h2>📜 Logs:</h2>

      <div className="logs-container">
        {logs.map((log, index) => (
          <div key={index} className="log-item">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UseEffectDemo;

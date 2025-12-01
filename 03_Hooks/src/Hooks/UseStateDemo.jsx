import React, { useState } from "react";

function UseStateDemo() {
  // Declare a state variable "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>🧮 useState Demo</h2>
      <h3>Count: {count}</h3>

      {/* Increase */}
      <button onClick={() => setCount(count + 1)}>➕ Increase</button>

      {/* Decrease */}
      <button onClick={() => setCount(count - 1)}>➖ Decrease</button>

      {/* Reset */}
      <button onClick={() => setCount(0)}>🔄 Reset</button>
    </div>
  );
}

export default UseStateDemo;

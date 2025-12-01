import React, { useRef } from "react";

function UseRefDemo() {
  const inputRef = useRef(null); // reference to input element
  const countRef = useRef(0); // value that doesn't cause re-render

  const handleFocus = () => {
    inputRef.current.focus(); // Focus the input
  };

  const handleIncrease = () => {
    countRef.current += 1; // Increase without re-render
    alert("Count (not rendered): " + countRef.current);
  };

  return (
    <div>
      <h2>⚛️ useRef Demo</h2>

      <input
        ref={inputRef}
        type="text"
        placeholder="Click button to focus me"
      />

      <br />
      <br />

      <button onClick={handleFocus}>🎯 Focus Input</button>

      <button onClick={handleIncrease}>🔢 Increase Count (No Re-render)</button>
    </div>
  );
}

export default UseRefDemo;

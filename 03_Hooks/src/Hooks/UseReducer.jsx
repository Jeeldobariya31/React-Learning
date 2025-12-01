import React, { useReducer } from "react";

// 🟢 Step 1: Reducer function
function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    case "reset":
      return { count: 0 };
    default:
      return state;
  }
}

function UseReducerDemo() {
  // 🟢 Step 2: useReducer hook
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <h2>⚛️ useReducer Demo</h2>
      <h3>Count: {state.count}</h3>

      {/* Increase */}
      <button onClick={() => dispatch({ type: "increment" })}>
        ➕ Increase
      </button>

      {/* Decrease */}
      <button onClick={() => dispatch({ type: "decrement" })}>
        ➖ Decrease
      </button>

      {/* Reset */}
      <button onClick={() => dispatch({ type: "reset" })}>🔄 Reset</button>
    </div>
  );
}

export default UseReducerDemo;

import { useState } from "react";
import "./App.css";
import UseRefDemo from "./Hooks/UseRefDemo";
import UseReducerDemo from "./Hooks/UseReducer";
import UseStateDemo from "./Hooks/UseStateDemo";
import UseEffectDemo from "./Hooks/UseEffectDemo";

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Custom Hooks Demo</h1>
      </header>
      <main className="app-main">
        <div className="main-content">
          <div className="left-column">
            <div className="hook-section">
              <UseEffectDemo />
            </div>
          </div>
          <div className="right-column">
            <div className="hook-section">
              <UseStateDemo />
            </div>
            <div className="hook-section">
              <UseReducerDemo />
            </div>
            <div className="hook-section">
              <UseRefDemo />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

// main.jsx

// ✅ Import React so we can use React.createElement (for reactEle)
import React from "react";

// ✅ StrictMode helps highlight potential problems in your app (only in development)
import { StrictMode } from "react";

// ✅ createRoot is used to connect React with the real DOM <div id="root"></div>
import { createRoot } from "react-dom/client";

// ✅ Default component of our app
import App from "./App.jsx";

// ===============================
// 1️⃣ Simple React Component
// ===============================
// Instead of <App />, we can also render <MyApp />.
// A component is just a JS function that returns JSX.
function MyApp() {
  return <h1>Hello from MyApp</h1>;
}

// ===============================
// 2️⃣ Plain JS Object "myEle" (❌ NOT a React element)
// ===============================
// This looks similar to a React element but it's just a normal JS object.
// React will NOT understand it because it is not created by JSX or React.createElement.
const myEle = {
  type: "a",
  props: {
    href: "https://google.com",
    target: "_blank",
    className: "my-link",
    style: {
      color: "white",
      backgroundColor: "black",
      padding: "8px 12px",
      borderRadius: "4px",
      textDecoration: "none",
    },
    onClick: () => {
      console.log("Link clicked!");
    },
    children: "Click me to visit Google",
  },
};

// ===============================
// 3️⃣ JSX Element "anotherEle" (✅ Valid React element)
// ===============================
// This is JSX. During build, JSX is converted into React.createElement(...)
// So this IS a real React element and can be rendered.
const anotherEle = <a href="https://google.com">Visit Google</a>;

// ===============================
// 4️⃣ React Element created manually (✅ Valid React element)
// ===============================
// This is how React elements look WITHOUT JSX.
// React.createElement(type, props, children)
const reactEle = React.createElement(
  "a",
  {
    href: "https://google.com",
    target: "_blank",
    className: "my-link",
    style: {
      color: "white",
      backgroundColor: "black",
      padding: "8px 12px",
      borderRadius: "4px",
      textDecoration: "none",
    },
    onClick: () => {
      alert("Link clicked!");
    },
  },
  "Click me to visit Google" // 👉 this is the "children" argument
);

// ===============================
// 5️⃣ Tell React where to render (root div in index.html)
// ===============================
const root = createRoot(document.getElementById("root"));

// ===============================
// 6️⃣ Render ANY ONE element/component here
// ===============================
root.render(
  <StrictMode>
    {/* ✅ Default: render App component */}
    <App />

    {/* 🔁 Try these one by one by uncommenting: */}

    {/* Render MyApp (component) */}
    {/* <MyApp /> */}

    {/* ❌ This will NOT work - myEle is only a JS object, not a React element */}
    {/* {myEle} */}

    {/* ✅ JSX element works */}
    {/* {anotherEle} */}

    {/* ✅ React element created by React.createElement works */}
    {/* {reactEle} */}
  </StrictMode>
);

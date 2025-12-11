// App.jsx

// This is a React component.
// A component is just a function that returns JSX.
function App() {
  // ✅ You can use normal JavaScript inside the component
  const myName = "Jeel";

  // JSX can use JS variables inside {} curly braces
  return <h1>Hello from {myName} in App</h1>;
}

// Export so that other files (like main.jsx) can import and use <App />
export default App;

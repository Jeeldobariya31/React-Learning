import "./telwind.css";
import Card from "./Card.jsx";

function Telwindtest() {
  return <h1 className="text-6xl font-bold underline">Hello world!</h1>;
}

function App() {
  return (
    <div className="App">
      {/* Tailwind Test */}
      <Telwindtest />
         <br />
      {/* card-1 without props (default values) */}
      <Card />
        <br />
      {/* card-2 with props */}
      <Card
        title="Custom Card"
        subtitle="Props are working perfectly!"
        buttonLabel="Click Me"
      />
    </div>
  );
}

export default App;

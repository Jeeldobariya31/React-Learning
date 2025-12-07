import "./App.css";
import React, { useContext } from "react";
import UserContextProvider from "./context/userContextProvider";
import UserContext from "./context/userContext";
import Login from "./components/Login";
import Profile from "./components/Profile";

function AppContent() {
  const { user } = useContext(UserContext);

  return <div>{user ? <Profile /> : <Login />}</div>;
}

function App() {
  return (
    <UserContextProvider>
      <AppContent />
    </UserContextProvider>
  );
}

export default App;

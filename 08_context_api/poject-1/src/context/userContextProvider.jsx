import React from "react";
import UserContext from "./userContext";

const UserContextProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [repos, setRepos] = React.useState([]);
  const [loading, setLoading] = React.useState(false); // better default: false
  const [error, setError] = React.useState(null);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        repos,
        setRepos,
        loading,
        setLoading,
        error,
        setError,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;

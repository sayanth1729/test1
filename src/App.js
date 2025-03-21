import React, { useState } from "react";
import Home from "./components/Home";
import Login from "./components/Login";

const App = () => {
  const [user, setUser] = useState(null);
  const [scanResults, setScanResults] = useState([]); 
  const [errorMessage, setErrorMessage] = useState(""); 
  const handleLogin = (username, role) => {
    setUser({ username, role });
  };

  const handleScan = (databaseName) => {
    fetch("http://127.0.0.1:5000/scan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ database: databaseName }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.vulnerabilities) {
          setScanResults(data.vulnerabilities); 
          setErrorMessage(""); 
        } else if (data.message) {
          setScanResults([]); 
          setErrorMessage(data.message); 
        }
      })
      .catch((error) => {
        setScanResults([]); 
        setErrorMessage("An error occurred during the scan.");
        console.error("Error during scan:", error);
      });
  };

  return (
    <div>
      {user ? (
        <Home
          username={user.username}
          role={user.role}
          onScan={handleScan} 
          scanResults={scanResults} 
          errorMessage={errorMessage} 
        />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;

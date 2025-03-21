import React, { useState } from "react";

const Home = ({ username, role }) => {
  const [database, setDatabase] = useState("");
  const [scanResults, setScanResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [inappropriateRoles, setInappropriateRoles] = useState([]);
  const [roleErrorMessage, setRoleErrorMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [permissionsList, setPermissionsList] = useState([]);

  const showAlertIfNoDatabase = () => {
    if (!database) {
      alert("Please enter the database name");
      return true;
    }
    return false;
  };

  const handleScan = () => {
    if (showAlertIfNoDatabase()) return;

    console.log("Starting scan...");

    setInappropriateRoles([]);
    setRoleErrorMessage("");
    setDeleteMessage("");

    fetch("http://127.0.0.1:5000/scan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ database }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Scan API Response:", data);
        if (data.vulnerabilities && data.vulnerabilities.length > 0) {
          setScanResults(data.vulnerabilities);
          setErrorMessage("");
        } else if (data.message) {
          setScanResults([]);
          setErrorMessage(data.message);
        }
      })
      .catch(() => {
        setScanResults([]);
        setErrorMessage("An error occurred during the scan.");
      });
  };

  const handleRoleAnalysis = () => {
    if (showAlertIfNoDatabase()) return;

    console.log("Starting role analysis...");

    setScanResults([]);
    setErrorMessage("");
    setDeleteMessage("");

    fetch("http://127.0.0.1:5000/role_analysis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Role Analysis API Response:", data);
        if (data.inappropriate_roles && data.inappropriate_roles.length > 0) {
          setInappropriateRoles(data.inappropriate_roles);
          setRoleErrorMessage("");
        } else {
          setInappropriateRoles([]);
          setRoleErrorMessage("No excessive privileges found.");
        }
      })
      .catch(() => {
        setInappropriateRoles([]);
        setRoleErrorMessage("An error occurred during role analysis.");
      });
  };

  const handleDeletePrivileges = () => {
    if (showAlertIfNoDatabase()) return;

    console.log("Deleting excessive privileges...");

    fetch("http://127.0.0.1:5000/delete_excess_privileges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Delete Privileges API Response:", data);
        if (data.message) {
          setDeleteMessage(data.message);
        }
        handleRoleAnalysis();
      })
      .catch(() => {
        setDeleteMessage("An error occurred while deleting privileges.");
      });
  };

  const handlePermissionsList = () => {
    if (showAlertIfNoDatabase()) return;

    console.log("Fetching permissions list...");

    fetch("http://127.0.0.1:5000/permissions_list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Permissions List API Response:", data);
        if (data.permissions && data.permissions.length > 0) {
          setPermissionsList(data.permissions);
          setErrorMessage("");
        } else {
          setPermissionsList([]);
          setErrorMessage("No permissions found.");
        }
      })
      .catch(() => {
        setPermissionsList([]);
        setErrorMessage("An error occurred while fetching permissions.");
      });
  };

  const handleLogout = () => {
    window.location.reload();
  };

  return (
    <div className="home-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Database Vulnerability Dashboard</h1>
          <p>
            Welcome, <strong>{username || "Guest"}</strong> | Role:{" "}
            <strong>{role || "Unknown"}</strong>
          </p>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>

        <div className="scan-form">
          <input
            type="text"
            placeholder="Enter Database Name"
            className="input-box"
            value={database}
            onChange={(e) => setDatabase(e.target.value)}
          />
        </div>

        <div className="button-container">
          <button className="action-button" onClick={handleScan}>
            Scan Database
          </button>

          <button className="action-button" onClick={handleRoleAnalysis}>
            Analyze Roles and Permissions
          </button>

          {username === "sys01admin" && (
            <button className="action-button" onClick={handleDeletePrivileges}>
              Delete Excess Privileges
            </button>
          )}

          <button className="action-button" onClick={handlePermissionsList}>
            Permissions List
          </button>
        </div>

        {errorMessage && <div className="error">{errorMessage}</div>}
        {roleErrorMessage && <div className="error">{roleErrorMessage}</div>}
        {deleteMessage && <div className="success">{deleteMessage}</div>}

        {scanResults.length > 0 && (
          <div className="results-container">
            <h2>Scan Results</h2>
            <table className="results-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Description</th>
                  <th>Severity</th>
                </tr>
              </thead>
              <tbody>
                {scanResults.map((result, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{result.description}</td>
                    <td>{result.severity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {inappropriateRoles.length > 0 && (
          <div className="results-container">
            <h2>Role Analysis Results</h2>
            <table className="results-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Issue</th>
                </tr>
              </thead>
              <tbody>
                {inappropriateRoles.map((result, index) => (
                  <tr key={index}>
                    <td>{result.username}</td>
                    <td>{result.role}</td>
                    <td>{result.issue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {permissionsList.length > 0 && (
          <div className="results-container">
            <h2>Permissions List</h2>
            <table className="results-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Permission Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {permissionsList.map((permission, index) => (
                  <tr key={index}>
                    <td>{permission.id}</td>
                    <td>{permission.permission}</td>
                    <td>{permission.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

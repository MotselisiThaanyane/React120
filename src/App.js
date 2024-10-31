import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import ProductManagement from "./components/ProductManagement";
import UserManagement from "./components/UserManagement";
import Auth from "./components/Auth";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Default to false
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  // This effect runs only when the component mounts
  useEffect(() => {
    // Always clear the logged-in status on app start
    localStorage.removeItem("isLoggedIn");
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <Router>
      <div>
        <header>
          <h1>Wings Cafe Inventory System</h1>
          {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
        </header>
        {isLoggedIn ? (
          <>
            <nav>
              <ul>
                <li>
                  <Link to="/dashboard">Stock Overview</Link>
                </li>
                <li>
                  <Link to="/productManagement">Product Management</Link>
                </li>
                <li>
                  <Link to="/userManagement">User Management</Link>
                </li>
              </ul>
            </nav>
            <Routes>
              <Route
                path="/dashboard"
                element={<Dashboard products={products} />}
              />
              <Route
                path="/productManagement"
                element={
                  <ProductManagement
                    products={products}
                    setProducts={setProducts}
                  />
                }
              />
              <Route
                path="/userManagement"
                element={<UserManagement users={users} setUsers={setUsers} />}
              />
              <Route path="/" element={<Navigate replace to="/dashboard" />} />
            </Routes>
          </>
        ) : (
          <Routes>
            <Route path="/" element={<Auth onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;

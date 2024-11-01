import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./App.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  // Remove isLoggedIn state from localStorage on initial load
  useEffect(() => {
    localStorage.removeItem("isLoggedIn");
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [users, setUsers] = useState(
    () => JSON.parse(localStorage.getItem("users")) || []
  );
  const [products, setProducts] = useState(
    () => JSON.parse(localStorage.getItem("products")) || []
  );
  const [isRegistering, setIsRegistering] = useState(false);
  const [activeSection, setActiveSection] = useState("stockOverview");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [editProductIndex, setEditProductIndex] = useState(null);
  const [editUserIndex, setEditUserIndex] = useState(null);

  // Handle login and logout
  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  const handleRegisterUser = (newUser) => {
    setUsers([...users, newUser]);
    localStorage.setItem("users", JSON.stringify([...users, newUser]));
    handleLogin();
  };

  const handleAddProduct = (newProduct) => {
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  };

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("products", JSON.stringify(products));
  }, [users, products]);

  // Manage form submissions
  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    // Check if the username or email already exists
    const existingUser = users.find(
      (u) => u.username === username || u.email === email
    );

    if (existingUser) {
      alert("Username or email already exists. Please use a different one.");
      return;
    }

    const newUser = { username, email, password };
    handleRegisterUser(newUser);

    // Clear form fields
    setUsername("");
    setEmail("");
    setPassword("");
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      handleLogin();
      setUsername("");
      setPassword("");
    } else {
      alert("Invalid username or password!");
    }
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    const product = {
      name: productName,
      description: productDescription,
      category: productCategory,
      price: parseFloat(productPrice),
      quantity: parseInt(productQuantity, 10),
    };

    if (editProductIndex === null) {
      handleAddProduct(product);
    } else {
      const updatedProducts = products.map((prod, index) =>
        index === editProductIndex ? product : prod
      );
      setProducts(updatedProducts);
      setEditProductIndex(null);
    }
    setProductName("");
    setProductDescription("");
    setProductCategory("");
    setProductPrice("");
    setProductQuantity("");
  };

  const editProduct = (index) => {
    const product = products[index];
    setProductName(product.name);
    setProductDescription(product.description);
    setProductCategory(product.category);
    setProductPrice(product.price);
    setProductQuantity(product.quantity);
    setEditProductIndex(index);
  };

  const deleteProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  // Product chart data setup
  const productNames = [...new Set(products.map((product) => product.name))];
  const quantities = productNames.map((name) =>
    products
      .filter((product) => product.name === name)
      .reduce((total, product) => total + Number(product.quantity), 0)
  );

  const data = {
    labels: productNames,
    datasets: [
      {
        label: "Product Quantity",
        data: quantities,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Products Overview",
      },
    },
    maintainAspectRatio: false,
  };

  // Function to add or edit a user
  const handleUserSubmit = (e) => {
    e.preventDefault();
    const newUser = { username, email, password };

    if (editUserIndex === null) {
      // Add new user
      setUsers((prevUsers) => [...prevUsers, newUser]);
    } else {
      // Edit existing user
      setUsers((prevUsers) =>
        prevUsers.map((user, index) =>
          index === editUserIndex ? newUser : user
        )
      );
      setEditUserIndex(null);
    }

    // Reset form fields
    setUsername("");
    setEmail("");
    setPassword("");
  };

  // Function to edit a user
  const editUser = (index) => {
    const user = users[index];
    setUsername(user.username);
    setEmail(user.email);
    setPassword(user.password);
    setEditUserIndex(index);
  };

  // Function to delete a user
  const deleteUser = (index) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
  };

  return (
    <div>
      {isLoggedIn ? (
        <section id="dashboardSection">
          <header>
            <h1>Wings Cafe Inventory System</h1>
            <button id="logoutButton" onClick={handleLogout}>
              Logout
            </button>
          </header>

          <nav>
            <ul>
              <li>
                <button onClick={() => setActiveSection("stockOverview")}>
                  Stock Overview
                </button>
              </li>
              <li>
                <button onClick={() => setActiveSection("productManagement")}>
                  Product Management
                </button>
              </li>
              <li>
                <button onClick={() => setActiveSection("userManagement")}>
                  User Management
                </button>
              </li>
            </ul>
          </nav>

          {activeSection === "stockOverview" && (
            <div style={{ width: "700px", height: "400px", margin: "auto" }}>
              <Bar data={data} options={options} />
            </div>
          )}

          {activeSection === "productManagement" && (
            <section id="productManagement">
              <h2>Manage Products</h2>
              <form onSubmit={handleProductSubmit}>
                <input
                  type="text"
                  value={productName}
                  placeholder="Product Name"
                  required
                  onChange={(e) => setProductName(e.target.value)}
                />
                <input
                  type="text"
                  value={productDescription}
                  placeholder="Description"
                  required
                  onChange={(e) => setProductDescription(e.target.value)}
                />
                <select
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Choose category
                  </option>
                  <option value="Hot Beverage">Hot Beverage</option>
                  <option value="Cold Beverage">Cold Beverage</option>
                  <option value="Baked">Baked</option>
                  <option value="Fried Food">Fried Food</option>
                  <option value="Junk">Junk</option>
                  <option value="Snacks">Snacks</option>
                </select>
                <input
                  type="number"
                  value={productPrice}
                  placeholder="Price"
                  required
                  onChange={(e) => setProductPrice(e.target.value)}
                />
                <input
                  type="number"
                  value={productQuantity}
                  placeholder="Quantity"
                  required
                  onChange={(e) => setProductQuantity(e.target.value)}
                />
                <button type="submit">
                  {editProductIndex === null ? "Add Product" : "Update Product"}
                </button>
              </form>

              <h3>Existing Products</h3>
              <table id="productTable">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index}>
                      <td>{product.name}</td>
                      <td>{product.description}</td>
                      <td>{product.category}</td>
                      <td>{product.price.toFixed(2)}</td>
                      <td>{product.quantity}</td>
                      <td>
                        <button onClick={() => editProduct(index)}>Edit</button>
                        <button onClick={() => deleteProduct(index)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {activeSection === "userManagement" && (
            <section id="userManagement">
              <h2>Manage Users</h2>
              <form onSubmit={handleUserSubmit}>
                <input
                  type="text"
                  value={username}
                  placeholder="Username"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="email"
                  value={email}
                  placeholder="Email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  value={password}
                  placeholder="Password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">
                  {editUserIndex === null ? "Add User" : "Update User"}
                </button>
              </form>

              <h3>Existing Users</h3>
              <table id="userTable">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={index}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        <button onClick={() => editUser(index)}>Edit</button>
                        <button onClick={() => deleteUser(index)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </section>
      ) : (
        <div className="auth-container">
          {isRegistering ? (
            <>
              <h2>Register</h2>
              <form onSubmit={handleRegisterSubmit}>
                <input
                  type="text"
                  value={username}
                  placeholder="Username"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="email"
                  value={email}
                  placeholder="Email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  value={password}
                  placeholder="Password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Register</button>
              </form>
              <p>
                Have an account?{" "}
                <a href="#" onClick={() => setIsRegistering(false)}>
                  Login here
                </a>
              </p>
            </>
          ) : (
            <>
              <h2>Login</h2>
              <form onSubmit={handleLoginSubmit}>
                <input
                  type="text"
                  value={username}
                  placeholder="Username"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="password"
                  value={password}
                  placeholder="Password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
              </form>
              <p>
                Don't have an account?{" "}
                <a href="#" onClick={() => setIsRegistering(true)}>
                  Register here
                </a>
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

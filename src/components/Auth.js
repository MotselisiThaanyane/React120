import React, { useState } from "react";

function Auth({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const existingUser = users.find(
      (u) => u.username === username || u.email === email
    );

    if (existingUser) {
      alert("Username or email already exists. Please use a different one.");
      return;
    }

    const newUser = { username, email, password };
    localStorage.setItem("users", JSON.stringify([...users, newUser]));
    onLogin();
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      onLogin();
    } else {
      alert("Invalid username or password!");
    }
  };

  return (
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
            <button onClick={() => setIsRegistering(false)}>Login here</button>
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
            <button onClick={() => setIsRegistering(true)}>
              Register here
            </button>
          </p>
        </>
      )}
    </div>
  );
}

export default Auth;

import React, { useState, useEffect } from "react";

const UserManagement = ({ users, setUsers }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editUserIndex, setEditUserIndex] = useState(null);

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(savedUsers);
  }, [setUsers]);

  const handleUserSubmit = (e) => {
    e.preventDefault();
    const newUser = { username, email, password };

    // Check for existing username or email
    const existingUser = users.find(
      (user) =>
        (user.username === newUser.username && editUserIndex === null) || // New user case
        (user.email === newUser.email && editUserIndex === null) || // New user case
        (user.username === newUser.username &&
          editUserIndex !== null &&
          user.username !== users[editUserIndex].username) || // Edit case (different username)
        (user.email === newUser.email &&
          editUserIndex !== null &&
          user.email !== users[editUserIndex].email) // Edit case (different email)
    );

    if (existingUser) {
      alert("Username or email already exists. Please use a different one.");
      return;
    }

    const updatedUsers =
      editUserIndex === null
        ? [...users, newUser]
        : users.map((user, index) =>
            index === editUserIndex ? newUser : user
          );

    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    setEditUserIndex(null);
    setUsername("");
    setEmail("");
    setPassword("");
  };

  const editUser = (index) => {
    const user = users[index];
    setUsername(user.username);
    setEmail(user.email);
    setPassword(user.password);
    setEditUserIndex(index);
  };

  const deleteUser = (index) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  return (
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
                <button onClick={() => deleteUser(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default UserManagement;

import React, { useEffect, useState } from 'react'
import axios from 'axios';
import '../../styles/admin/allUsers.css'

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    await axios.get("http://localhost:6001/fetch-users").then(
      (response) => {
        setUsers(response.data);
      }
    ).catch((err) => {
      console.log(err);
    })
  }

  useEffect(() => {
    fetchUsers();
  }, [])

  return (
    <div className="all-users-page">
      <h3>All Users</h3>
      <div className="all-users">
        {users.map((user) => (
          <div className="user-card" key={user._id}>
            <div className="user-field">
              <b>User Id</b>
              <p>{user._id}</p>
            </div>
            <div className="user-field">
              <b>Username</b>
              <p>{user.username}</p>
            </div>
            <div className="user-field">
              <b>Email</b>
              <p>{user.email}</p>
            </div>
            <div className="user-field">
              <b>User Role</b>
              <p>{user.usertype}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllUsers

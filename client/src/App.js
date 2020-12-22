import React, {useEffect, useState, useCallback} from 'react'
import axios from "axios";

const App = function () {
    const [users, setUsers] = useState([])
    const [username, setUsername] = useState("")

    useEffect(() => {
        axios
            .get('/api/ping')
            .then((res) => console.log(res.data.message))
            .catch((e) => console.error(e))
    }, [])

    useEffect(() => {
        axios
            .get('/api/users')
            .then((users) => setUsers(users))
            .catch((err) => console.error(err));
    }, [setUsers]);

    const handleChange = useCallback((e) => {
        setUsername(e.target.value)
    }, [setUsername])

    const handleSubmit = useCallback((e) => {
        if (username === "") {
            alert("Please fill the username field");
            return;
        }
        axios
            .post("/api/users", {
                name: username
            })
            .then(function () {
                alert("Account created successfully");
            })
            .catch(function () {
                alert("Could not creat account. Please try again");
            });
    }, [username])

  return (
      <div>
          <h1>My Project</h1>
          {users === null ? (
              <p>Loading...</p>
          ) : users.length === 0 ? (
              <p>No user available</p>
          ) : (
              <>
                  <h2>Available Users</h2>
                  <ol>
                      {users.data.map((user, index) => (
                          <li key={index}>
                              Name: {user.name} - id: {user.id}
                          </li>
                      ))}
                  </ol>
              </>
          )}
          <form onSubmit={handleSubmit}>
              <input
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter your username"
              />
              <button type="submit">Submit</button>
          </form>
      </div>
  )
}

export default App;

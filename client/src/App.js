import React, {useEffect, useState, useCallback} from 'react'
import axios from "axios";

import style from './App.module.css'

const App = function () {
    const [users, setUsers] = useState([])
    const [username, setUsername] = useState("")

    const [user, setUser] = useState('')
    const [message, setMessage] = useState('')

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
        e.preventDefault()
        if (username === "") {
            alert("Please fill the username field");
            return;
        }
        axios
            .post("/api/users", {
                name: username
            })
            .then(res => {
                if (res?.data?.message) {
                    setMessage(res.data.message)
                } else {
                    setUser(res.data.user)
                    //window.location.reload()
                }
            })
            .catch(e => console.error(e));
    }, [username])

  return (
      <div className={style.container}>
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
                              <p>Name: {user.name}</p>
                              <p>id: {user.id}</p>
                              <p>giftTo: {user.giftTo}</p>
                              <p>giftFrom: {user.giftFrom}</p>
                          </li>
                      ))}
                  </ol>
              </>
          )}
          </div>
          <div>
          <form onSubmit={handleSubmit}>
              <input
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter your username"
              />
              <button type="submit">Submit</button>
          </form>
          {user?.name && <p>{`Тебе достался ${user.name}`}</p>}
          {message && <p>{message}</p>}
          </div>
      </div>
  )
}

export default App;

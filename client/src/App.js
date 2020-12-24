import React, {useEffect, useState, useCallback} from 'react'
import axios from "axios"

import style from './App.module.css'

const App = function () {
    const [users, setUsers] = useState([])
    const [username, setUsername] = useState("")

    const [user, setUser] = useState('')

    const [errorMes, setErrorMes] = useState('')

    useEffect(() => {
        axios
            .get('/api/ping')
            .then((res) => console.log(res.data.message))
            .catch((e) => console.error(e))
    }, [])

    useEffect(() => {
        axios
            .get('/api/users')
            .then((users) => setUsers(users.data))
            .catch((err) => console.error(err));
    }, [setUsers]);

    const handleChange = useCallback((e) => {
        setUsername(e.target.value)
    }, [setUsername])

    const handleUpdate = useCallback(() => {
        axios
            .put('/api/users', {})
            .then((res) => {
                console.log(res.data.message)
                setTimeout(() => {
                    window.location.reload()
                }, 4000)
            })
            .catch(e => console.error(e))
    }, [])

    const handleSubmit = useCallback((e) => {
        e.preventDefault()
        if (username === "") {
            alert("Please fill the username field");
            return;
        }
        const user = users.find((user) => user.name === username)
        if ( !user ) {
            setErrorMes(`Нет такого пользователя ${username}`)
        } else if ( user?.giftTo ) {
            setErrorMes(`У тебя уже есть кому дарить ${user.giftTo}`)
        } else {
            axios
                .post("/api/users", { currentUser: user })
                .then(res => {
                    if (res?.data?.message) {
                        setErrorMes(res.data.message)
                    }
                    setUser(res?.data?.user)
                    setTimeout(() => {
                        window.location.reload()
                    }, 4000)
                })
                .catch(e => console.error(e));
        }
    }, [users, username])

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
                      {users.map((user) => (
                          <li key={user.name}>
                              <p>Name: {user.name}</p>
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
              <button type="button" onClick={handleUpdate}>Очистить</button>
          </form>
          {user?.name && <p>{`Тебе достался ${user.name}`}</p>}
          {errorMes && <p>{errorMes}</p>}
          </div>
      </div>
  )
}

export default App;

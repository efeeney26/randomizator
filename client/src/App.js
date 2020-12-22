import React, {useEffect, useState, useCallback} from 'react'
import axios from "axios";

const App = function () {
    const [text, setText] = useState('')
    const [post, setPost] = useState('')
    const [savedPost, setSavedPost] = useState('')

    const [users, setUsers] = useState(null);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    const fetchData = async () => {
        const resp = await fetch('/api/hello')
        return await resp.json()
    }

    useEffect( () => {
        fetchData()
            .then(res => setText(res.express))
            .catch(e => console.log(e))
    }, [])

    useEffect(() => {
        axios
            .get("/api/users")
            .then((users) => setUsers(users))
            .catch((err) => console.log(err));
    }, []);

    const handleChange = useCallback((e) => {
        setPost(e.target.value)
    }, [setPost])


    function submitForm(e) {
        e.preventDefault()
        if (username === "") {
            alert("Please fill the username field");
            return;
        }
        if (email === "") {
            alert("Please fill the email field");
            return;
        }
        axios
            .post("/api/users", {
                username: username,
                email: email,
            })
            .then(function () {
                alert("Account created successfully");
                window.location.reload();
            })
            .catch(function () {
                alert("Could not creat account. Please try again");
            });
    }

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault()
        const response = await fetch('/api/world', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: post }),
        });
        const body = await response.text();
        setSavedPost(body)
    }, [post])

  return (
      <div>
          {text}
          <form
              onSubmit={handleSubmit}
          >
              <input type="text" value={post} onChange={handleChange}/>
              <button type="submit">Submit</button>
          </form>
          <p>{savedPost}</p>
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
          <form onSubmit={submitForm}>
              <input
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  placeholder="Enter your username"
              />
              <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  placeholder="Enter your email address"
              />
              <input type="submit" />
          </form>
      </div>
  )
};

export default App;

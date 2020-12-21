import React, {useEffect, useState, useCallback} from 'react'

const App = function () {
    const [text, setText] = useState('')
    const [post, setPost] = useState('')
    const [savedPost, setSavedPost] = useState('')

    const fetchData = async () => {
        const resp = await fetch('/api/hello')
        return await resp.json()
    }

    useEffect( () => {
        fetchData()
            .then(res => setText(res.express))
            .catch(e => console.log(e))
    }, [])

    const handleChange = useCallback((e) => {
        setPost(e.target.value)
    }, [setPost])


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
      </div>
      
  )
};

export default App;

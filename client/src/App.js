import React, { useEffect, useCallback, useReducer } from 'react'
import axios from 'axios'
import * as VFX from 'react-vfx'

import face from './assets/face.png'

import style from './App.module.css'

const initialState = {
    users: [],
    currentUserName: '',
    sideUser: {},
    message: ''
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_USERS':
            return {
                ...state,
                users: action.users
            }
        case 'SET_CURRENT_USERNAME':
            return {
                ...state,
                message: '',
                currentUserName: action.currentUserName
            }
        case 'SET_SIDE_USER':
            return {
                ...state,
                sideUser: action.sideUser
            }
        case 'SET_MESSAGE':
            return {
                ...state,
                message: action.message
            }
        default:
            return initialState
    }
}

const App = function () {
    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        axios
            .get('/api/ping')
            .then((res) => console.log(res.data.message))
            .catch((e) => console.error(e))
    }, [])

    useEffect(() => {
        axios
            .get('/api/users')
            .then((res) => {
                dispatch({ type: 'SET_USERS', users: res.data })
            })
            .catch((err) => console.error(err))
    }, [dispatch])

    const handleChange = useCallback((e) => {
        dispatch({ type: 'SET_CURRENT_USERNAME', currentUserName: e.target.value })
    }, [dispatch])

    const handleSubmit = useCallback((e) => {
        e.preventDefault()
        if (state.currentUserName === '') {
            alert('Please fill the username field')
            return
        }
        const user = state.users.find((user) => user.name === state.currentUserName)
        if (!user) {
            dispatch({ type: 'SET_MESSAGE', message: `Нет такого пользователя ${state.currentUserName}` })
        } else if (user?.giftTo) {
            dispatch({ type: 'SET_MESSAGE', message: `У тебя уже есть кому дарить ${user.giftTo}` })
        } else {
            axios
                .post('/api/users', { currentUser: user })
                .then(res => {
                    if (res?.data?.message) {
                        dispatch({ type: 'SET_MESSAGE', message: res.data.message })
                    }
                    dispatch({ type: 'SET_SIDE_USER', sideUser: res?.data?.user })
                    setTimeout(() => {
                        window.location.reload()
                    }, 4000)
                })
                .catch(e => console.error(e))
        }
    }, [state.users, state.currentUserName])

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

    return (
        <div className={style.container} >
            <VFX.VFXProvider>
                <VFX.VFXImg src={face} width="100%" height="100%" shader="rgbShift"/>
            </VFX.VFXProvider>
            <form
                onSubmit={handleSubmit}
                className={style.form}
            >
                <input
                    id="username"
                    onChange={handleChange}
                    type="text"
                    placeholder="Введи имя..."
                    className={style.input}
                />
                <button
                    type="submit"
                    className={style.button}
                >
                    Найти пару
                </button>
                <button type="button" onClick={handleUpdate}>Очистить</button>
            </form>
            {state.sideUser?.name && <p>{`Тебе достался ${state.sideUser.name}`}</p>}
            {state.message && <p>{state.message}</p>}
        </div>
    )
}

export default App

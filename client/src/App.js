import React, { useEffect, useCallback, useReducer, useState, useMemo } from 'react'
import axios from 'axios'
import * as VFX from 'react-vfx'
import Particles from 'react-particles-js'

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
    const [isLoading, setLoading] = useState(false)

    const filteredUsers = useMemo(() => state.users.filter((user) => user?.giftFrom), [state.users])

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
            alert('Введи имя')
            return
        }
        const user = state.users.find((user) => user.name === state.currentUserName)
        if (!user) {
            dispatch({ type: 'SET_MESSAGE', message: `Нет такого пользователя ${state.currentUserName}` })
        } else if (user?.giftTo) {
            dispatch({ type: 'SET_MESSAGE', message: `У тебя уже есть кому дарить ${user.giftTo}` })
        } else {
            setLoading(true)
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

    /* const handleUpdate = useCallback(() => {
        axios
            .put('/api/users', {})
            .then((res) => {
                console.log(res.data.message)
                setTimeout(() => {
                    window.location.reload()
                }, 4000)
            })
            .catch(e => console.error(e))
    }, []) */

    return (
        <div className={style.container} >
            <Particles
                style={{
                    position: 'fixed',
                    height: '100vh'
                }}
                params={{
                    particles: {
                        number: {
                            value: 20,
                            density: {
                                enable: true,
                                value_area: 800
                            }
                        },
                        line_linked: {
                            enable: false
                        },
                        move: {
                            speed: 1,
                            out_mode: 'out'
                        },
                        shape: {
                            type: [
                                'image',
                                'circle'
                            ],
                            image: [
                                {
                                    src: face,
                                    height: 50,
                                    width: 50
                                },
                                {
                                    src: face,
                                    height: 50,
                                    width: 50
                                },
                                {
                                    src: face,
                                    height: 50,
                                    width: 50
                                },
                                {
                                    src: face,
                                    height: 50,
                                    width: 50
                                },
                                {
                                    src: face,
                                    height: 50,
                                    width: 50
                                }
                            ]
                        },
                        color: {
                            value: '#CCC'
                        },
                        size: {
                            value: 30,
                            random: false,
                            anim: {
                                enable: true,
                                speed: 4,
                                size_min: 10,
                                sync: false
                            }
                        }
                    },
                    retina_detect: false
                }} />
            <VFX.VFXProvider>
                <VFX.VFXImg src={face} width="70%" height="70%" shader="rgbShift"/>
            </VFX.VFXProvider>
            <form
                onSubmit={handleSubmit}
                className={style.form}
            >
                {<p style={{ color: 'white' }}>Кол-во участников - {state.users.length}</p>}
                {<p style={{ color: 'white', marginTop: '0' }}>Участники с подарками - {filteredUsers.length}</p>}
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
                    disabled={isLoading}
                >
                    Найти пару
                </button>
                {/* <button type="button" onClick={handleUpdate}>Очистить</button> */}
                {state.sideUser?.name && <p style={{ color: 'white' }}>{`Тебе достался ${state.sideUser.name}`}</p>}
                {state.message && <p style={{ color: 'white' }}>{state.message}</p>}
            </form>
        </div>
    )
}

export default App

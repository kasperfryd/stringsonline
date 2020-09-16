import React, { useState, useEffect, useContext } from 'react'
import Style from './login.module.scss'
import { useForm } from "react-hook-form";
import { AppContext } from "../../context/ContextProvider"

function Login() {

    // set states needed by component
    const [message, setMessage] = useState("Indtast login oplysninger")
    const { loginData, setLoginData, getCart } = useContext(AppContext);

    const onSubmit = (data, e) => sendLoginRequest(data, e);

    const { register, handleSubmit, errors } = useForm();

    // POST request with formdata from login input fields
    const sendLoginRequest = (data, e) => {
        e.target.reset()
        let formData = new FormData()
        formData.append('username', data.username)
        formData.append('password', data.password)

        let url = 'https://api.mediehuset.net/token';

        console.log(formData)
        fetch(url, {
            method: "POST",
            body: formData,
        })

            .then(response => response.json())
            .then(json => handleSessionData(json))
            .catch(error => setMessage(error))
    }

    // function to handle session data (save data or set not authorized message)
    const handleSessionData = (key) => {
        if (!key.message) {
            setLoginData(key)
            console.log(key)
            sessionStorage.setItem('token', JSON.stringify(key))
        }

        if (key.message === "No authorization") {
            setMessage("Forkert brugernavn eller password - prøv igen")
        }
    }

    // function to log out
    const logOut = () => {
        setLoginData([])
        sessionStorage.removeItem('token');
        setMessage("Du er nu logget ud")

        let timer = setTimeout(() => {
            setMessage("Indtast login oplysninger")
            clearTimeout(timer)
        }, 3500);
    }

    useEffect(() => {
        if (sessionStorage.getItem('token')) {
            setLoginData(JSON.parse(sessionStorage.getItem('token')))
        }
    }, [])

    return (
        <>
            <h4>{loginData && loginData.username ? `Du er logget ind som ${loginData.username}` : message}</h4>
            <form className={Style.loginform} onSubmit={handleSubmit(onSubmit)}>
                <b>Log in</b>
                <label>Username:</label>
                <input name="username" ref={register({ required: true })} />
                    {errors.username && <span>Please fill out username</span>}
                <label>Password:</label>
                <input name="password" type="password" ref={register({ required: true })}></input>
                    {errors.password && <span>Please fill out password</span>}
                {loginData && !loginData.user_id &&
                    <button className={Style.loginbtn}>LOG IND</button>
                }
                {loginData && loginData.user_id &&
                    <button onClick={() => {logOut() }} className={Style.logoutbtn}>LOG UD</button>
                }
            </form>
        </>
    )
}

export default Login
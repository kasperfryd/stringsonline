import React from 'react'
import Login from '../../components/login/login'
import '../../components/theme/global.scss'


function LoginPage(){

    // Return html and login component
    return (
        <section className={"mainContainer"}>
            <Login></Login>
        </section>
    )
}

export default LoginPage
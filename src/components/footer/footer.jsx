import React from 'react'
import footerImg from '../../assets/footer.png'
import Style from './footer.module.scss'

function Footer() {

    return (
        <footer className={Style.footer}>
            <img src={footerImg} alt="footerimage"></img>
        </footer>
    )
}

export default Footer
import React, { useState } from 'react'
import Style from './submenu.module.scss';

function Submenu(props) {

    // Props submenu component accepts
    const child = props.child || "No child content selected"
    const title = props.title || "Accordian"

    // State to set submenu active
    const [active, setActive] = useState(false)

    return (
        <section className={Style.wrapper}>
            <div className={Style.accordion} onClick={() => { active ? setActive(false) : setActive(true) }} >{title}</div>
            <div className={active ? Style.shown : Style.hidden}>{child}</div>
        </section>
    )
}

export default Submenu
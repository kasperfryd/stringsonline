import React, {useContext} from 'react'
import Style from './breadcrumb.module.scss'
import {AppContext} from '../../context/ContextProvider'
import { Link } from 'react-router-dom';
import homeIcon from '../../assets/home-icon.png'


function BreadCrumb(){

    // Imports from context
    const { groupName, subGroupName, productName, setGroupName, setSubgroupName, setProductName,} = useContext(AppContext);

    return (
        <ul className={Style.breadCrumb}>
            <li onClick={() => { setProductName(""); setSubgroupName(""); setGroupName("") }}><Link to="/stringsonline/forside"><img className={Style.home} src={homeIcon} alt="home-icon"></img>Forside</Link>&#x5c;</li>
            {groupName !== "" && <li onClick={() => { setProductName("")}}>{groupName} &#x5c;</li>}
            {subGroupName !== "" && <li onClick={() => { setProductName("") }}>{subGroupName} &#x5c;</li>}
            {productName !== "" && <li>{productName}</li>}
        </ul>
    )
}

export default BreadCrumb
import React, {useContext} from 'react'
import Style from './breadcrumb.module.scss'
import {AppContext} from '../../context/ContextProvider'
import { Link } from 'react-router-dom';


function BreadCrumb(){

    const { groupName, subGroupName, productName, setGroupName, setSubgroupName, setProductName,} = useContext(AppContext);

    return (
        <ul className={Style.breadCrumb}>
            <li onClick={() => { setProductName(""); setSubgroupName(""); setGroupName("") }}><Link to="/forside">Forside</Link>{" >"}</li>
            {!groupName == "" && <li onClick={() => { setProductName("")}}>{groupName}{" >"}</li>}
            {!subGroupName == "" && <li onClick={() => { setProductName("") }}>{subGroupName}{" >"}</li>}
            {!productName == "" && <li>{productName}</li>}
        </ul>
    )
}

export default BreadCrumb
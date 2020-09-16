import React, {useContext, useState, useEffect} from 'react'
import Style from './header.module.scss'
import {Link} from 'react-router-dom'
import BreadCrumb from '../breadcrumb/breadcrumb'
import {AppContext} from '../../context/ContextProvider'
import headerImg from '../../assets/headerbanner.svg'
import cartIcon from '../../assets/cart-icon.png'

function Header(){

    const {setGroupName, setSubgroupName, setProductName, setSearchRes, cartQuantity, loginData} = useContext(AppContext);
    const [searchQuery, setSearchQuery] = useState("")

    async function doSearch(query){
        try {
          let url =`https://api.mediehuset.net/stringsonline/search/${query}`
          const response = await fetch(url)
          const data = await response.json()
          setSearchRes(data)
        }
        catch (error) {
          console.log(error)
        }
      }

    return (
        <header className={Style.wrapper}>
        <div className={Style.topGrid}>
            <span></span>
            <p>SALES@STRINGSONLINE.DK</p>
            <p>+45 98 12 22 68</p>
            <Link onClick={()=>{setGroupName("Indkøbskurv"); setSubgroupName(""); setProductName("")}}  to="/kurv"><img src={cartIcon} alt="cart-icon"></img><span className={Style.cartQuantity}>{cartQuantity}</span></Link>
        </div>

                <nav className={Style.navGrid}>
                    <img alt={"StringsOnline_Logo"} src={headerImg}></img>
                    <Link className={Style.link1} onClick={()=>{setGroupName(""); setSubgroupName(""); setProductName("")}} to="/forside">Forside</Link>
                    <Link className={Style.link2} to="/betingelser" onClick={()=>{setGroupName("Betingelser"); setSubgroupName(""); setProductName("")}} >Salgs- og handelsbetingelser</Link>
                    <Link className={Style.link3} to="/logind"><button onClick={() => {setGroupName("Log ind"); setSubgroupName(""); setProductName("")}}>{loginData.access_token ? "Log ud" : "Log ind"}</button></Link>
                <form className={Style.searchGrid}>
                    <input type="text" name="query" onChange={(e)=>{setSearchQuery(e.target.value)}}></input>
                    <Link onClick={()=>{doSearch(searchQuery); setGroupName("Søgeresultat"); setSubgroupName(""); setProductName("")}} to="/søgeresultat"><button>Søg</button></Link>
                </form>
                </nav>

                <div className={Style.breadCrumb}>
                    <BreadCrumb/>
                </div>
        </header>
    )
}

export default Header
import React, {useContext, useState} from 'react'
import Style from './header.module.scss'
import {Link} from 'react-router-dom'
import BreadCrumb from '../breadcrumb/breadcrumb'
import {AppContext} from '../../context/ContextProvider'
import headerImg from '../../assets/header-bg.png'
import cartIcon from '../../assets/cart-icon.png'
import phoneIcon from '../../assets/phone-icon.png'
import mailIcon from '../../assets/mail-icon.png'

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
            <span><img src={mailIcon} alt="mail-icon"></img><p>SALES@STRINGSONLINE.DK</p></span>
            <span><img src={phoneIcon} alt="phone-icon"></img><p>+45 98 12 22 68</p></span>
            <span><Link onClick={()=>{setGroupName("Indkøbskurv"); setSubgroupName(""); setProductName("")}}  to="/kurv"><img src={cartIcon} alt="cart-icon"></img><p className={Style.counter}>{cartQuantity}</p></Link></span>
        </div>
        <section className={Style.header}>
            <nav className={Style.topNav}>
                <img className={Style.headerImage} alt={"StringsOnline_Logo"} src={headerImg}></img>
                <div className={Style.links}>
                    <Link onClick={()=>{setGroupName(""); setSubgroupName(""); setProductName("")}} to="/forside">Forside</Link>
                    <Link to="/betingelser" onClick={()=>{setGroupName("Betingelser"); setSubgroupName(""); setProductName("")}} >Salgs- og handelsbetingelser</Link>
                    <Link to="/logind"><button onClick={() => {setGroupName("Log ind"); setSubgroupName(""); setProductName("")}}>{loginData.access_token ? "Log ud" : "Log ind"}</button></Link>
                </div>
            </nav>
                <form className={Style.search}>
                    <input type="text" name="query" onChange={(e)=>{setSearchQuery(e.target.value)}}></input>
                    <Link onClick={()=>{doSearch(searchQuery); setGroupName("Søgeresultat"); setSubgroupName(""); setProductName("")}} to="/søgeresultat"><button>Søg</button></Link>
                </form>
        </section>
                <div className={Style.breadCrumb}>
                    <BreadCrumb/>
                    {loginData.access_token ? <Link onClick={()=>{setGroupName("Ordrehistorik")}} className={Style.orderHistory} to="/ordrehistorik">Ordrehistorik</Link> : null}
                </div>
        </header>
    )
}

export default Header
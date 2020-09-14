import React, {useContext, useState, useEffect} from 'react'
import Style from './header.module.scss'
import {Link} from 'react-router-dom'
import BreadCrumb from '../breadcrumb/breadcrumb'
import {AppContext} from '../../context/ContextProvider'

function Header(){

    const {setGroupName, setSubgroupName, setProductName, setSearchRes} = useContext(AppContext);
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        console.log(searchQuery)
    }, [searchQuery])

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
            <Link to="/kurv"><p>KURV HER</p></Link>
        </div>

                <nav className={Style.navGrid}>
                    <p>StringsOnline</p>
                    <Link onClick={()=>{setGroupName(""); setSubgroupName(""); setProductName("")}} to="/forside">Forside</Link>
                    <Link to="/betingelser" onClick={()=>{setGroupName("Betingelser"); setSubgroupName(""); setProductName("")}} >Salgs- og handelsbetingelser</Link>
                    <Link to="/logind"><button onClick={() => {setGroupName("Log ind"); setSubgroupName(""); setProductName("")}}>Login</button></Link>
                </nav>
                <form className={Style.searchGrid}>
                    <input type="text" name="query" onChange={(e)=>{setSearchQuery(e.target.value)}}></input>
                    <Link onClick={()=>{doSearch(searchQuery); setGroupName("Søgeresultat"); setSubgroupName(""); setProductName("")}} to="/søgeresultat"><button>Søg</button></Link>
                </form>

                <div className={Style.breadCrumb}>
                    <BreadCrumb/>
                </div>
        </header>
    )
}

export default Header
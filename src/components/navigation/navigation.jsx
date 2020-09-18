import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from "../../context/ContextProvider"
import { Link } from 'react-router-dom';
import Style from './navigation.module.scss'
import Submenu from './submenu';


function Navigation() {

    // Imports from context
    const { doFetch, setGroupID, setSubID, setGroupName, setSubgroupName, setProductName, setBrandID } = useContext(AppContext);
    
    // States needed by component
    const [groups, setGroups] = useState([])
    const [brands, setBrands] = useState([])

    // Function to fetch all data
    async function getGroups(){
        let url = `https://api.mediehuset.net/stringsonline/`
        let data = await doFetch(url)
        setGroups(data)
    }

    // Function to fetch all brands
    async function getBrands(){
        let url = `https://api.mediehuset.net/stringsonline/brands`
        let data = await doFetch(url)
        setBrands(data)
    }

    // useEffect that runs when component mounts, to get data
    useEffect(() => {
        getGroups()
        getBrands()
    }, [])

    // return html
    return (
            <aside className={Style.aside}>
                <ul className={Style.menu_shown}>
                    {groups && groups.productgroups && groups.productgroups.items &&  groups.productgroups.items.map((item, i) => {
                        if (!item.subgroups) {
                            return <Link  onClick={() => {setGroupID(item.id); setGroupName(item.title)}} className={Style.link} key={i} to={"/stringsonline/" + item.title.toLowerCase()}>
                                {<p>{item.title}</p>}
                            </Link>
                        }
                        else{
                            return(
                                <div key={i} className={item.sub ? Style.dropdown : ""}>
                                <Submenu title={<p className={Style.link}>{item.title}</p>} child = {
                                item.subgroups && item.subgroups.map((sub, i) => {
                                    return( 
                                            <Link onClick={() =>  {setGroupID(item.id); setSubID(sub.id); setGroupName(item.title); setSubgroupName(sub.title); setProductName("")}} className={Style.link} key={i} to={"/stringsonline/"+ item.title.toLowerCase() + "/" + sub.title.toLowerCase()}>{sub.title}</Link>
                                        )
                                    })}
                                    ></Submenu>
                            </div>
                            )
                        }
                    }
                    )}
                    {
                        <Submenu title={<p className={Style.link}>Brands</p>} child = {
                        brands && brands.items && brands.items.map((item, i) => {
                            return (
                                <Link onClick={() =>  {setBrandID(item.id); setGroupName("Brands"); setSubgroupName(item.title); setProductName("")}} className={Style.link} key={i} to={"/stringsonline/brands/" + item.title.toLowerCase()}>{item.title}</Link>
                        )}
                    )}
                    ></Submenu>
                    }
                    </ul>
            </aside>
    )
}

export default Navigation
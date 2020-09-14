import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from "../../context/ContextProvider"
import { Link } from 'react-router-dom';
import Style from './navigation.module.scss'
import Submenu from './submenu';


function Navigation() {

    const { doFetch, setGroupID, setSubID, setGroupName, setSubgroupName, setProductName } = useContext(AppContext);
    const [groups, setGroups] = useState([])

    async function getGroups(){
        let url = `https://api.mediehuset.net/stringsonline/`
        let data = await doFetch(url)
        setGroups(data)
    }

    useEffect(() => {
        getGroups()
    }, [])

    // return html
    return (
            <aside className={Style.aside}>
                <ul className={Style.menu_shown}>
                    {groups && groups.productgroups && groups.productgroups.items &&  groups.productgroups.items.map((item, i) => {
                        if (!item.subgroups) {
                            return <Link  onClick={() => {setGroupID(item.id); setGroupName(item.title)}} className={Style.link} key={i} to={"/" + item.title.toLowerCase()}>
                                {<p>{item.title}</p>}
                            </Link>
                        }
                        else{
                            return(
                                <div key={i} className={item.sub ? Style.dropdown : ""}>
                                <Submenu title={<p className={Style.link}>{item.title}</p>} child = {
                                item.subgroups && item.subgroups.map((sub, i) => {
                                    return( 
                                            <Link onClick={() =>  {setGroupID(item.id); setSubID(sub.id); setGroupName(item.title); setSubgroupName(sub.title); setProductName("")}} className={Style.link} key={i} to={"/"+ item.title.toLowerCase() + "/" + sub.title.toLowerCase()}>{sub.title}</Link>
                                        )
                                    })}
                                    ></Submenu>
                            </div>
                            )
                        }
                    }
                    )}
                </ul>
            </aside>
    )
}

export default Navigation
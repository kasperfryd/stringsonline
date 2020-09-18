import React, { useContext, useEffect, useState } from 'react'
import { Route } from 'react-router-dom'
import ProductPage from '../pages/productpage/productpage'
import { AppContext } from "../context/ContextProvider"

function ProductRoutes() {

    // Imports from context
    const { doFetch } = useContext(AppContext);
    
    // States needed by component
    const [res, setRes] = useState([])

    // Function to get all data
    async function getRoutes() {
        let url = `https://api.mediehuset.net/stringsonline/`
        let data = await doFetch(url)
        setRes(data)
    }

    // useEffect that runs when component mounts to get all data
    useEffect(() => {
        getRoutes()
    }, [])

    // return routes from data productgroups and subgroups
    return (
        res && res.productgroups && res.productgroups.items ? res.productgroups.items.map((item, i) => {
            if (!item.subgroups) {
                return <Route key={i} path={"/" + item.title.toLowerCase()}>
                    <ProductPage />
                </Route>

            }
            else {
                return (
                    item.subgroups && item.subgroups.map((sub, i) => {
                        return (
                            <Route key={i} path={"/stringsonline/" + item.title.toLowerCase() + "/" + sub.title.toLowerCase()}>
                                <ProductPage />
                            </Route>
                        )
                    })
                )
            }
        }
        ) : null
    )
}

export default ProductRoutes
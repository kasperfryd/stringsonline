import React, { useContext, useEffect, useState } from 'react'
import { Route } from 'react-router-dom'
import ProductPage from '../pages/productpage/productpage'
import { AppContext } from "../context/ContextProvider"
import BrandsPage from '../pages/brands/brandspage';

function ProductRoutes() {

    const { doFetch } = useContext(AppContext);
    const [res, setRes] = useState([])

    async function getRoutes() {
        let url = `https://api.mediehuset.net/stringsonline/`
        let data = await doFetch(url)
        setRes(data)
    }

    useEffect(() => {
        getRoutes()
    }, [])

    // return html
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
                            <Route key={i} path={"/" + item.title.toLowerCase() + "/" + sub.title.toLowerCase()}>
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
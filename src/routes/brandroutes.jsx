import React, { useContext, useEffect, useState } from 'react'
import { Route } from 'react-router-dom'
import { AppContext } from "../context/ContextProvider"
import BrandsPage from '../pages/brands/brandspage';

function BrandRoutes() {

    const { doFetch } = useContext(AppContext);
    const [brands, setBrands] = useState([])

    async function getBrands() {
        let url = `https://api.mediehuset.net/stringsonline/brands`
        let data = await doFetch(url)
        setBrands(data)
    }
    //console.log(brands)

    useEffect(() => {
        getBrands()
    }, [])

    // return html
    return (
        brands && brands.items && brands.items ? brands.items.map((item, i) => {
            return (
                        <Route key={i} path={"/stringsonline/brands/" + item.title.toLowerCase()}>
                            <BrandsPage />
                        </Route>
                    )}
        )
            : null)
}

export default BrandRoutes
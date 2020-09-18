import React, { useContext, useEffect, useState } from 'react'
import { Route } from 'react-router-dom'
import { AppContext } from "../context/ContextProvider"
import BrandsPage from '../pages/brands/brandspage';

function BrandRoutes() {

    // Import from context
    const { doFetch } = useContext(AppContext);
    
    // State needed by component
    const [brands, setBrands] = useState([])

    // Function to get all brands
    async function getBrands() {
        let url = `https://api.mediehuset.net/stringsonline/brands`
        let data = await doFetch(url)
        setBrands(data)
    }

    // useEffect that runs when component mounts to get all brands
    useEffect(() => {
        getBrands()
    }, [])

    // return routes from all brands
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
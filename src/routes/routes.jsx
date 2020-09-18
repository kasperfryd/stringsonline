import React from 'react'
import ProductRoutes from './productroutes'
import BrandRoutes from './brandroutes'
import StaticRoutes from './staticroutes'


function Routes() {

    // Return all routes back to App.js
    return (
        <>
        <ProductRoutes/>
        <BrandRoutes/>
        <StaticRoutes/>
        </>
    )
}

export default Routes
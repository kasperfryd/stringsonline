import React from 'react'
import { Route } from 'react-router-dom'
import FrontPage from '../pages/frontpage/frontpage'
import LoginPage from '../pages/loginpage/loginpage'
import TermsPage from '../pages/termspage/termspage'
import CartPage from '../pages/cartpage/cartpage'
import SearchPage from '../pages/searchpage/searchpage'
import CheckoutPage from '../pages/checkoutpage/checkoutpage'
import HistoryPage from '../pages/historypage/historypage'

function StaticRoutes() {

    return (
        <>
            <Route path="/forside">
                <FrontPage />
            </Route>

            <Route path="/logind">
                <LoginPage />
            </Route>

            <Route path="/betingelser">
                <TermsPage />
            </Route>

            <Route path="/ordrehistorik">
                <HistoryPage/>
            </Route>

            <Route path="/kurv">
                <CartPage />
            </Route>

            <Route path="/kassen">
                <CheckoutPage/>
            </Route>

            <Route path="/søgeresultat">
                <SearchPage />
            </Route>

            <Route exact path="/">
                <FrontPage/>
            </Route>
        </>
    )
}

export default StaticRoutes
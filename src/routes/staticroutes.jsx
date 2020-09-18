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
            <Route path="/stringsonline/forside">
                <FrontPage />
            </Route>

            <Route path="/stringsonline/logind">
                <LoginPage />
            </Route>

            <Route path="/stringsonline/betingelser">
                <TermsPage />
            </Route>

            <Route path="/stringsonline/ordrehistorik">
                <HistoryPage/>
            </Route>

            <Route path="/stringsonline/kurv">
                <CartPage />
            </Route>

            <Route path="/stringsonline/kassen">
                <CheckoutPage/>
            </Route>

            <Route path="/stringsonline/søgeresultat">
                <SearchPage />
            </Route>

            <Route exact path="/stringsonline/">
                <FrontPage/>
            </Route>
        </>
    )
}

export default StaticRoutes
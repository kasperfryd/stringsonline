import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import './components/theme/global.scss'
import Navigation from './components/navigation/navigation'
import Header from './components/header/header'
import ProductRoutes from './routes/productroutes'
import FrontPage from './pages/frontpage/frontpage'
import LoginPage from './pages/loginpage/loginpage'
import TermsPage from './pages/termspage/termspage'
import BasketPage from './pages/basketpage/basketpage'
import SearchPage from './pages/searchpage/searchpage'

// TODO:

// Frontpage page
// Basket Component + Page
// Checkout page
// Favorites Component
// Footer component
// OrderHistory page
// Order complete component
// Brands page
// Seachresult page


// Header component (DONE)
// Navigation (aside) Component (DONE)
// Breadcrumb Component (DONE)
// Product page (DONE)
// Product details page (DONE)
// Login page (DONE)

function App() {
  return (
    <Router>
      <Header/>
      <main className={'mainWrapper'}>
      <Navigation/>
      <Switch>
        <Route path="/forside">
          <FrontPage/>
        </Route>
        <Route path="/logind">
          <LoginPage/>
        </Route>
        <Route path="/betingelser">
          <TermsPage/>
        </Route>
        <Route path="/kurv">
          <BasketPage/>
        </Route>
        <Route path="/søgeresultat">
          <SearchPage/>
        </Route>
        <ProductRoutes/>      
      </Switch>
      </main>
    </Router>
  );
}

export default App;

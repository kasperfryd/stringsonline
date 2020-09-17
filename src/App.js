import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import './components/theme/global.scss'
import Navigation from './components/navigation/navigation'
import Header from './components/header/header'
import Footer from './components/footer/footer';
import Routes from './routes/routes';

// TODO:


// Cleanup
// Comments
// Mobil styling


// styling
// Ratings
// Content on termspage
// Sortering
// OrderHistory page
// Offerprice
// Order completed page
// Checkout page
// Cart Page (DONE)
// Brands page (DONE)
// Footer component (DONE)
// Seachresult page (DONE)
// Frontpage page (DONE)
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
        <Routes/>
      </Switch>
      </main>
      <Footer/>
    </Router>
  );
}

export default App;

import React from 'react';
import {BrowserRouter as Router, Switch} from 'react-router-dom'
import './components/theme/global.scss'
import Navigation from './components/navigation/navigation'
import Header from './components/header/header'
import Footer from './components/footer/footer';
import Routes from './routes/routes';

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

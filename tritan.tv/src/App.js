import './App.css';
import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/Navbar';
import LoginForm from './components/Login';

function App() {
  return (
      <Router>
        <div className="App">
          <Navbar />
          <Route path="/" component={Home}></Route>
          <Route path='/login' component={LoginForm} />
        </div>
      </Router>
  );
}

export default App;

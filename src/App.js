import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink
} from "react-router-dom";

// Page Imports
import SearchPage from './pages/SearchPage'
import SchedulePage from './pages/SchedulePage'

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li id="title">
              <Link to="/">Bobcat Search</Link>
            </li>
            <li className="icon">
              <NavLink to="/schedule">
                <img src="./img/edit-calendar.svg" alt="Edit Calendar"/>
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/schedule">
            <SchedulePage />
          </Route>
          <Route path="/">
            <SearchPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

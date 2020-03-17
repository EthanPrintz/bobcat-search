import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink
} from "react-router-dom";

// Page Imports
import SearchPage from "./pages/SearchPage";
import SchedulePage from "./pages/SchedulePage";
import CoursePage from "./pages/CoursePage";

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
                <img src="./img/edit-calendar.svg" alt="Edit Calendar" />
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route exact path="/course" component={CoursePage} />
          <Route exact path="/schedule" component={SchedulePage} />
          <Route exact path="/" component={SearchPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;

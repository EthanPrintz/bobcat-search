import React, { useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
} from "react-router-dom";

// Page Imports
import SearchPage from "./pages/SearchPage";
import SchoolPage from "./pages/SchoolPage";
import SubjectPage from "./pages/SubjectPage";
import CoursePage from "./containers/CoursePageContainer";
import SchedulePage from "./containers/SchedulePageContainer";

function App() {
  const getPath = () => {
    return window.location.pathname + window.location.search;
  };

  /* eslint-disable no-unused-vars */
  const [year, setYear] = useState(2020);
  const [semester, setSemester] = useState("fa");
  // if we start on schedule page, the first toggle brings us to home
  // otherwise, the first toggle brings us to schedule page
  const [toggle, setToggle] = useState(
    getPath() === "/schedule" ? "/" : "/schedule"
  );
  /* eslint-enable no-unused-vars */

  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li id="title">
              <Link to="/">Bobcat Search</Link>
            </li>
            <li className="icon">
              {toggle !== "/schedule" ? (
                <NavLink to={toggle} onClick={() => setToggle("/schedule")}>
                  <img src="./img/edit-calendar.svg" alt="Edit Calendar" />
                </NavLink>
              ) : (
                <NavLink to="/schedule" onClick={() => setToggle(getPath)}>
                  <img src="./img/edit-calendar.svg" alt="Edit Calendar" />
                </NavLink>
              )}
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route
            path="/course"
            render={(props) => (
              <CoursePage {...props} year={year} semester={semester} />
            )}
          />
          <Route
            path="/school"
            render={(props) => (
              <SchoolPage {...props} year={year} semester={semester} />
            )}
          />
          <Route
            path="/subject"
            render={(props) => (
              <SubjectPage {...props} year={year} semester={semester} />
            )}
          />
          <Route
            exact
            path="/schedule"
            render={(props) => (
              <SchedulePage {...props} year={year} semester={semester} />
            )}
          />
          <Route
            exact
            path="/"
            render={(props) => (
              <SearchPage {...props} year={year} semester={semester} />
            )}
          />
        </Switch>
      </div>
    </Router>
  );
}

export default App;

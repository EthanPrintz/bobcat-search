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
import CoursePage from "./pages/CoursePage";
import SchedulePage from "./pages/SchedulePage";
import { Select, MenuItem } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";

const BootstrapInput = withStyles((theme) => ({
  input: {
    borderRadius: 4,
    border: "1px solid #9e9e9e",
    fontSize: "1rem",
    padding: "10px 26px 10px 12px",
    fontWeight: "bold",
    color: "var(--grey800)",
    fontFamily: "var(--primaryFont)",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:focus": {
      borderRadius: 4,
    },
  },
}))(InputBase);

function App() {
  const getPath = () => window.location.pathname + window.location.search;

  const options = [
    {
      name: "Fall 2020",
      code: "fa-2020",
    },
    {
      name: "January 2021",
      code: "ja-2021",
    },
    {
      name: "Spring 2021",
      code: "sp-2021",
    },
    {
      name: "Summer 2021",
      code: "su-2021",
    },
  ];

  /* eslint-disable no-unused-vars */
  const [year, setYear] = useState(2021);
  const [semester, setSemester] = useState("sp");
  // if we start on schedule page, the first toggle brings us to home
  // otherwise, the first toggle brings us to schedule page
  const [toggle, setToggle] = useState(
    getPath() === "/schedule" ? "/" : "/schedule"
  );
  /* eslint-enable no-unused-vars */

  const handleOnChange = (event) => {
    const code = event.target.value;
    const [sem, currYear] = code.split("-");
    setSemester(sem);
    setYear(parseInt(currYear));
  };

  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <ul>
              <li id="title">
                <Link to="/">Bobcat Search</Link>
              </li>
              <Select
                displayEmpty
                onChange={handleOnChange}
                defaultValue={`${semester}-${year}`}
                value={`${semester}-${year}`}
                input={<BootstrapInput />}
              >
                {options.map((item) => {
                  return (
                    <MenuItem key={item.name} value={item.code}>
                      {item.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </ul>
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

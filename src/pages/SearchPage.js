import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";

// Keyframe Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const deptFadeIn = keyframes`
  from {
    opacity: 0;
    padding-top: 6rem;
  }

  to {
    opacity: 1;
    padding-top: 4rem;
  }
`;

// Styled Components
const SearchContainer = styled.div`
  position: relative;
  min-height: 60vh;
`;

const DepartmentContainer = styled.div`
  width: 100%;
  min-height: 50vh;
  border-top: 1rem solid var(--grey200);
  background-color: var(--grey300);
  position: relative;

  & > #departmentTitle {
    font-size: 1.7rem;
    padding: 1rem;
    font-weight: bold;
    color: var(--grey700);
    position: absolute;
    top: 0.3rem;
    left: 0.3rem;
    animation: ${fadeIn} 1.2s ease forwards;
  }
`;

const Departments = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(22rem, 1fr));
  grid-gap: 1rem;
  padding: 6rem 2rem 2rem 2rem;
  animation: ${deptFadeIn} 0.8s ease forwards;
`;

const School = styled.div`
  padding: 1rem;
  cursor: pointer;

  & > .schoolLink > .schoolTitle {
    font-size: 1.2rem;
    font-family: var(--condensedFont);
    text-align: center;
    margin: 1rem 0;

    & > .schoolCode {
      padding: 0.3rem;
      color: var(--grey600);
      font-weight: 800;
    }

    & > .schoolName {
      color: var(--grey900);
    }
  }
`;

const Department = styled.div`
  margin: 0.3rem 0;

  & > .departmentCode {
    color: var(--grey600);
    font-family: var(--condensedFont);
    font-weight: 700;
  }
`;

export default function SearchPage(props) {
  // Set state
  const [departments, setDepartments] = useState({ loading: true, data: {} });
  const [schools, setSchools] = useState({ loading: true, data: {} });

  // Query departments on component mount
  useEffect(() => {
    // Get Schedge data
    (async () => {
      fetch("https://schedge.a1liu.com/subjects")
        .then(response => response.json()) // one extra step
        .then(data => setDepartments({ loading: false, data }))
        .catch(error => console.error(error));
    })();
    (async () => {
      fetch("https://schedge.a1liu.com/schools")
        .then(response => response.json()) // one extra step
        .then(data => setSchools({ loading: false, data }))
        .catch(error => console.error(error));
    })();
  }, []);

  return (
    <div id="pageContainer">
      <SearchContainer>
        <SearchBar year={props.year} semester={props.semester} />
      </SearchContainer>
      <DepartmentContainer>
        <div id="departmentTitle">Majors</div>
        {!schools.loading && !departments.loading && (
          <Departments>
            {Object.keys(departments.data)
              .sort((a, b) => {
                return (
                  Object.keys(departments.data[b]).length -
                  Object.keys(departments.data[a]).length
                );
              })
              .map((schoolCode, i) => (
                <School key={i}>
                  <Link
                    className="schoolLink"
                    to={{
                      pathname: "/school",
                      search: `?school=${schoolCode}`
                    }}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="schoolTitle">
                      <span className="schoolCode">{schoolCode}</span>
                      <span className="schoolName">
                        {schools.data[schoolCode]?.name ?? ""}
                      </span>
                    </div>
                  </Link>
                  {Object.keys(departments.data[schoolCode])
                    .sort((a, b) => {
                      return a.localeCompare(b);
                    })
                    .map((departmentCode, i) => (
                      <Link
                        key={i}
                        to={{
                          pathname: "/subject",
                          search: `?school=${schoolCode}&subject=${departmentCode}`
                        }}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <Department>
                          <span className="departmentCode">
                            {departmentCode}
                          </span>
                          <span className="departmentName">
                            &nbsp;
                            {departments.data[schoolCode][
                              departmentCode
                            ]?.name.replace(/,/g, "")}
                          </span>
                        </Department>
                      </Link>
                    ))}
                </School>
              ))}
          </Departments>
        )}
      </DepartmentContainer>
    </div>
  );
}

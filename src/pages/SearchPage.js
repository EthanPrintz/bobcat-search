import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import "./css/SearchPage.css";

import SearchBar from "../components/SearchBar";

const SearchContainer = styled.div`
  position: relative;
  min-height: 60vh;
`;

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

export default function SearchPage() {
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
        <SearchBar />
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
                <div className="school" key={i}>
                  <div className="schoolTitle">
                    <span className="schoolCode">{schoolCode}</span>
                    <span className="schoolName">
                      {schools.data[schoolCode]?.name.replace(/,/g, "") ?? ""}
                    </span>
                  </div>
                  {Object.keys(departments.data[schoolCode]).map(
                    (departmentCode, i) => (
                      <div className="department" key={i}>
                        <span className="departmentCode">{departmentCode}</span>
                        <span className="departmentName">
                          &nbsp;
                          {departments.data[schoolCode][
                            departmentCode
                          ]?.name.replace(/,/g, "")}
                        </span>
                      </div>
                    )
                  )}
                </div>
              ))}
          </Departments>
        )}
      </DepartmentContainer>
    </div>
  );
}

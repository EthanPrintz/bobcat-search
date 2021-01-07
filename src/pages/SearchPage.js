import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";
import { findSchool } from "../utils";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";

export default function SearchPage({ year, semester }) {
  // Set state
  const [departments, setDepartments] = useState({ loading: true, data: {} });
  const [schools, setSchools] = useState({ loading: true, data: {} });

  // Query departments on component mount
  useEffect(() => {
    // Get Schedge data and load it asyncronously
    (async () => {
      try {
        const response = await fetch("https://schedge.a1liu.com/subjects");
        if (!response.ok) {
          // handle invalid search parameters
          return;
        }
        const data = await response.json();
        setDepartments(() => ({ loading: false, data }));
      } catch (error) {
        console.error(error);
      }
    })();

    (async () => {
      try {
        const response = await fetch("https://schedge.a1liu.com/schools");
        if (!response.ok) {
          // handle invalid search parameters
          return;
        }
        const data = await response.json();
        setSchools(() => ({ loading: false, data }));
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <div id="pageContainer">
      <SearchContainer>
        <SearchBar year={year} semester={semester} />
      </SearchContainer>
      <DepartmentContainer>
        <div id="departmentTitle">Schools</div>
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
                      search: `?school=${schoolCode}`,
                      state: {
                        schoolName: schools.data[schoolCode]
                          ? schools.data[schoolCode].name
                          : findSchool(schoolCode),
                      },
                    }}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="schoolTitle">
                      <span className="schoolCode">{schoolCode}</span>
                      <span className="schoolName">
                        {schools.data[schoolCode]
                          ? schools.data[schoolCode].name
                          : findSchool(schoolCode)}
                      </span>
                    </div>
                  </Link>
                </School>
              ))}
          </Departments>
        )}
      </DepartmentContainer>
    </div>
  );
}

SearchPage.propTypes = {
  year: PropTypes.number.isRequired,
  semester: PropTypes.string.isRequired,
};

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
  grid-template-columns: repeat(2, minmax(22rem, 1fr));
  grid-gap: 0.5rem;
  padding: 6rem 2rem 2rem 2rem;
  animation: ${deptFadeIn} 0.8s ease forwards;
  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

const School = styled.div`
  padding: 0.25rem 0;
  cursor: pointer;

  & > .schoolLink > .schoolTitle {
    font-size: 1.2rem;
    font-family: var(--condensedFont);
    text-align: left;
    margin: 0.2rem 0;
    position: sticky;

    & > .schoolCode {
      padding: 0.5rem;
      color: var(--grey600);
      font-weight: 800;
    }

    & > .schoolName {
      color: var(--grey900);
    }
  }
`;

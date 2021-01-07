import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import qs from "qs";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { grey } from "@material-ui/core/colors";

export default function SchoolPage({ location }) {
  const { school } = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });
  const { schoolName } = location.state;
  const [loading, setLoading] = useState(true);
  const [schoolData, setSchoolData] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("https://schedge.a1liu.com/subjects");
        if (!response.ok) {
          // handle invalid search parameters
          return;
        }

        const data = await response.json();
        setSchoolData(() => data[school]);
        setLoading(() => false);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [setSchoolData]);

  return (
    <div>
      <DepartmentHeader>
        <div id="departmentTitle">{schoolName}</div>
      </DepartmentHeader>
      {loading && <span>Loading...</span>}
      {!loading && (
        <Departments>
          {Object.keys(schoolData).map((subjectid, i) => {
            const subject = schoolData[subjectid];
            return (
              <Link
                to={{
                  pathname: "/subject",
                  search: `?&school=${school}&subject=${subjectid}`,
                }}
                key={i}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Department>
                  <span className="departmentCode">{subjectid}</span>
                  <span className="departmentName">
                    &nbsp;
                    {subject.name}
                  </span>
                </Department>
              </Link>
            );
          })}
        </Departments>
      )}
    </div>
  );
}

SchoolPage.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
  }),
};

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

const DepartmentHeader = styled.div`
  width: 100vw;
  padding: 2vmin;
  font-size: 2rem;
  color: ${grey[900]};
`;

const Departments = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(22rem, 1fr));
  grid-gap: 0.5rem;
  padding: 5rem 2rem 2rem 2rem;
  animation: ${deptFadeIn} 0.8s ease forwards;
  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
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

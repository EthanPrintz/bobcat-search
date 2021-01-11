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
  const { schoolName } = location.state ? location.state : "";
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
    <PageContainer>
      <DepartmentHeader>
        <div id="departmentTitle">{schoolName ? schoolName : school}</div>
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
    </PageContainer>
  );
}

SchoolPage.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
    state: PropTypes.object,
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

const PageContainer = styled.div`
  background-color: ${grey[200]};
  width: 100vw;
  min-height: 100vh;
`;

const DepartmentHeader = styled.div`
  width: 100vw;
  padding: 2vmin 2vmin 0vmin 4vmin;
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
  padding: 0.3rem 0;

  & > .departmentCode {
    color: var(--grey600);
    font-family: var(--condensedFont);
    font-weight: 700;
  }

  &:hover {
    background-color: ${grey[300]};
  }
`;

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import qs from "qs";
import styled from "styled-components";
import { Link } from "react-router-dom";

export default function SchoolPage({ location }) {
  const { school } = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });
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
        setSchoolData(() => data);
        setLoading(() => false);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [setSchoolData]);

  return (
    <div>
      <DepartmentHeader>
        <div id="departmentTitle">{school}</div>
      </DepartmentHeader>
      {loading && <span>Loading...</span>}
      {!loading && (
        <div>
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
                <div
                  style={{
                    padding: 15,
                  }}
                >
                  <span>{subjectid}</span>-<span>{subject.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

SchoolPage.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }),
};

const DepartmentHeader = styled.div`
  width: 100vw;
  padding: 3vmin;
  font-size: cacl(1vmin + 1rem);
`;

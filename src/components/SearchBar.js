import React, { useState } from "react";
import "./css/SearchBar.css";

export default function SearchBar() {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState({
    loading: false,
    results: []
  });

  const _handleChange = async event => {
    setSearchText(event.target.value);

    // handle empty search text
    if (event.target.value.replace(/\s/g, "").length === 0) {
      setSearchResults({ loading: false, results: [] });
      return;
    }
    setSearchResults({ loading: true, results: [] });
    // fetch results
    fetch(
      `https://schedge.a1liu.com/2020/su/search?query=${event.target.value}&limit=5`
    )
      .then(response => response.json())
      .then(results => setSearchResults({ loading: false, results }))
      .catch(error => console.error(error));
  };

  return (
    <>
      <img
        src="./loading.svg"
        id="courseLoading"
        alt="loading symbol"
        style={{ opacity: searchResults.loading ? 0.3 : 0 }}
      />
      <input
        id="searchBar"
        value={searchText}
        placeholder="Search Courses"
        onChange={_handleChange}
      ></input>
      <div id="searchResults">
        {searchText.replace(/\s/g, "").length !== 0 &&
          searchResults.results.map((course, i) => (
            <div className="course" key={i}>
              <span className="courseSchoolCode">
                {course.subjectCode.school}-{course.subjectCode.code}
              </span>
              <span className="courseId">{course.deptCourseId}</span>
              <span className="courseName">{course.name}</span>
            </div>
          ))}
      </div>
    </>
  );
}

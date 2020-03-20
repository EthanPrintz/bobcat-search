import React, { Component } from "react";
import qs from "qs";
import { Link } from "react-router-dom";

export default class SubjectPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      params: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }),
      loading: true,
      courseList: {}
    };
  }

  componentDidMount() {
    const { school, subject } = this.state.params;
    const { year, semester } = this.props;

    fetch(`https://schedge.a1liu.com/${year}/${semester}/${school}/${subject}`)
      .then(response => {
        if (!response.ok) {
          // handle invalid search parameters
          return;
        }
        return response.json();
      })
      .then(data => {
        this.setState({ loading: false, courseList: data });
      });
  }

  render() {
    return (
      <div>
        {this.state.loading && <span>Loading...</span>}
        {!this.state.loading && (
          <div>
            {this.state.courseList.map((course, i) => (
              <Link
                to={{
                  pathname: "/course",
                  search: `?&school=${course.subjectCode.school}&subject=${course.subjectCode.code}&courseid=${course.deptCourseId}`
                }}
                key={i}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: "black",
                    borderBottomStyle: "solid"
                  }}
                >
                  <h4>
                    {course.subjectCode.code}-{course.subjectCode.school}.
                    {course.deptCourseId} {course.name}
                  </h4>
                  <p>{course.sections.length} Sections</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }
}

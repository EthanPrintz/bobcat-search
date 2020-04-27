import React, { Component } from "react";
import qs from "qs";
import styled from "styled-components";
import { Link } from "react-router-dom";

const CourseContainer = styled.div`
  padding: 0.5vmax 5vmin;
  & h4{
    color: grey
  }
  & h3{

  }
  & p{
    color: rgb(50,50,50)
  }
`

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
                <CourseContainer>
                  <h4>
                    {course.subjectCode.code}-{course.subjectCode.school}.
                    {course.deptCourseId} 
                  </h4>
                  <h3>
                    {course.name}
                  </h3>
                  <p>{course.sections.length} Sections</p>
                </CourseContainer>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }
}

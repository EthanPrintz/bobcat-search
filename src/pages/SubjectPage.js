import React, { Component } from 'react';
import qs from 'qs';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { grey } from '@material-ui/core/colors';

export default class SubjectPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      params: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }),
      courseLoading: true,
      departmentLoading: true,
      schoolLoading: true,
      courseList: {},
      departmentList: {},
      schoolList: {},
    };
  }

  componentDidMount() {
    const { school, subject } = this.state.params;
    const { year, semester } = this.props;

    // Fetch courses within department
    fetch(`https://schedge.a1liu.com/${year}/${semester}/${school}/${subject}`)
      .then((response) => {
        if (!response.ok) {
          // handle invalid search parameters
          return;
        }
        return response.json();
      })
      .then((data) => {
        // Save data to local state
        this.setState({ courseLoading: false, courseList: data });
      });
    // Fetch department names
    fetch(`https://schedge.torchnyu.com/subjects`)
      .then((response) => {
        if (!response.ok) {
          // Handle invalid search parameters
          return;
        }
        return response.json();
      })
      .then((data) => {
        // Save data to local state
        this.setState({ departmentLoading: false, departmentList: data });
      });
    // Fetch school names
    fetch(`https://schedge.torchnyu.com/schools`)
      .then((response) => {
        if (!response.ok) {
          // Handle invalid search parameters
          return;
        }
        return response.json();
      })
      .then((data) => {
        // Save data to local state
        this.setState({ schoolLoading: false, schoolList: data });
      });
  }

  render() {
    return (
      <PageContainer>
        <HeaderBackground></HeaderBackground>
        {this.state.courseLoading &&
          this.state.schoolLoading &&
          this.state.departmentLoading && <span></span>}
        {!(
          this.state.courseLoading ||
          this.state.schoolLoading ||
          this.state.departmentLoading
        ) && (
          <div>
            <DepartmentHeader>
              <SchoolName>
                {
                  this.state.schoolList[
                    this.state.courseList[0].subjectCode.school
                  ].name
                }
              </SchoolName>
              <DepartmentName>
                {
                  this.state.departmentList[
                    this.state.courseList[0].subjectCode.school
                  ][this.state.courseList[0].subjectCode.code].name
                }
              </DepartmentName>
            </DepartmentHeader>
            <CourseContainer>
              {this.state.courseList.map((course, i) => (
                <Link
                  to={{
                    pathname: '/course',
                    search: `?&school=${course.subjectCode.school}&subject=${course.subjectCode.code}&courseid=${course.deptCourseId}`,
                  }}
                  key={i}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Course>
                    <h4>
                      {course.subjectCode.code}-{course.subjectCode.school}{' '}
                      {course.deptCourseId}
                    </h4>
                    <h3>{course.name}</h3>
                    <p>{course.sections.length} Sections</p>
                  </Course>
                </Link>
              ))}
            </CourseContainer>
          </div>
        )}
      </PageContainer>
    );
  }
}

// Styled components

const PageContainer = styled.div`
  background-color: ${grey[200]};
  width: 100vw;
  min-height: 100vh;
`;

const HeaderBackground = styled.div`
  width: 100vw;
  height: 5rem;
  background-color: ${grey[200]};
  margin-top: -3.5rem;
`;

const DepartmentHeader = styled.div`
  margin: 2vmin 0 2vmin 4vmax;
`;

const SchoolName = styled.div`
  color: ${grey[800]};
  font-size: 1.4rem;
`;

const DepartmentName = styled.div`
  color: ${grey[900]};
  font-weight: bold;
  font-size: 2.6rem;
  margin-top: -0.1rem;
`;

const CourseContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
`;

const Course = styled.div`
  padding: 0.5vmax 2vmin;
  width: 38vmin;
  min-height: 5vmax;
  background-color: ${grey[100]};
  margin: 1.6vmax;
  border-radius: 0.3rem;
  border-bottom: 0.2rem solid ${grey[300]};

  & > h4 {
    color: ${grey[600]};
  }
  & > p {
    color: ${grey[700]};
  }
`;

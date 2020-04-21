import React from "react";
import qs from "qs";
import styled from "styled-components";
import Moment from "moment";
import { Link } from "react-router-dom";

const CourseHeader = styled.div`
  width: 100vw;
  height: calc(14vmin + 3rem);
  padding: 2vmin 4vmin;
  background: linear-gradient(
    167deg,
    var(--purpleMain) 21%,
    #712991 60%,
    rgba(135, 37, 144, 1) 82%
  );
  color: var(--grey100);
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: flex-end;

  & #backButton {
    position: absolute;
    z-index: 2;
    top: 2vmin;
    left: 2vmin;
    height: 2.1rem;
    opacity: 0.7;
    transition: 0.15s;
  }
  & #backButton:hover {
    opacity: 1;
  }

  & #titleDepartment {
    font-size: calc(1vmin + 0.7rem);
    margin: 0 0 -0.5vmin 0.3vmin;
    font-family: var(--grey200);
  }

  & #titleName {
    font-size: calc(2.2vmin + 1.4rem);
    font-weight: bold;
  }
`;

const SectionsDescription = styled.div`
  margin-top: calc(12vmin + 6vh);
  padding: 1.8vmin 2.8vmin;
  font-size: 1.1rem;
  font-style: italic;
  width: 84%;
  margin-left: 8%;
`;

const SectionsHeader = styled.div`
  font-weight: bold;
  text-align: center;
  font-size: calc(1.2vmin + 1rem);
  padding: 2vmin;
  color: var(--grey800);
  margin-top: calc(2vmin + 1rem);
`;

const AddButton = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  border: 2px solid lightgrey;
  color: lightgrey;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  cursor: pointer;
  position: absolute;
  right: 1rem;
`;

const DateContainer = styled.div`
  border: 0.3rem solid var(--grey200);
  width: calc(6vmin + 8rem);
  border-radius: 0.35rem;
  text-align: center;
  display: inline-block;
  margin: 0.5vmin calc(1.2vmin + 2rem) 0.5vmin 0;
  margin-bottom: calc(1rem + 1vmin);

  & > .dayOfWeek {
    background-color: var(--grey200);
    color: var(--grey600);
    padding: 0.4rem calc(0.5vmin + 0.4rem);
    font-weight: bold;
    font-family: var(--primaryFont);
    font-size: 1.2rem;
  }

  & > .timeOfDay {
    padding: 0.4rem calc(0.5vmin + 0.4rem);
    font-family: var(--condensedFont);
    color: var(--grey700);
    font-weight: 500;
    font-size: 1.1rem;
  }
`;

const SectionContainer = styled.div`
  padding: 1.8vmin 2.8vmin;
  background-color: var(--grey100);
  width: 84%;
  margin-left: 8%;
  position: relative;

  & > .sectionNum {
    font-size: 1.6rem;
    font-family: var(--condensedFont);
    color: var(--grey700);
    margin: 0 0 -1rem 1rem;
  }

  & > .attributes {
    display: flex;
    flex-wrap: wrap;
  }
`;

const CourseSections = styled.div`
  & ${SectionContainer}:nth-child(odd) {
    background-color: var(--grey200);

    & > ${DateContainer} {
      border: 0.3rem solid var(--grey300);
    }

    & > ${DateContainer} > .dayOfWeek {
      background-color: var(--grey300);
      color: var(--grey700);
    }

    & > ${DateContainer} > .timeOfDay {
      color: var(--grey800);
    }
  }
`;

const AttributeContainer = styled.div`
  padding: calc(0.8vmin + 0.8rem);
  font-size: 1.5rem;
  color: var(--grey800);
  font-weight: bold;

  & > .attributeLabel {
    font-size: 1rem;
    font-family: var(--condensedFont);
    color: var(--grey700);
  }
`;

export default class CoursePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      params: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }),
      loading: true,
      courseData: {}
    };
  }

  componentDidMount() {
    const { school, subject, courseid } = this.state.params;
    const { year, semester } = this.props;
    fetch(
      `https://schedge.a1liu.com/${year}/${semester}/${school}/${subject}?full=true`
    )
      .then(response => {
        if (!response.ok) {
          // handle invalid search parameters
          return;
        }
        return response.json();
      })
      .then(data => {
        this.setState({
          courseData: data.filter(val => val.deptCourseId === courseid)[0],
          loading: false
        });
        this.state.courseData.sections.every(section => 
          console.log(section.description === this.state.courseData.sections[0].description)
        )
      })
      .catch(error => console.error(error));
  }

  render() {
    const { loading, courseData, wishlist } = this.state;
    return (
      <div>
        {loading && (
          <>
            <span>Loading...</span>
            <CourseHeader>
              <Link to="/" style={{ textDecoration: "none" }}>
                <img src="./img/go-back.svg" alt="Go back" id="backButton" />
              </Link>
            </CourseHeader>
          </>
        )}
        {!loading && (
          <>
            <CourseHeader>
              <Link to="/" style={{ textDecoration: "none" }}>
                <img src="./img/go-back.svg" alt="Go back" id="backButton" />
              </Link>
              <div>
                <div id="titleDepartment">
                  {courseData.subjectCode.code}-{courseData.subjectCode.school}
                </div>
                <div id="titleName">{courseData.name}</div>
              </div>
            </CourseHeader>
            {/* Handle course description here if all sections have the same one */}
            { courseData.sections.every(section => 
                section.description == courseData.sections[0].description
              ) && 
              <SectionsDescription>
                {courseData.sections[0].description}
              </SectionsDescription>
            }
            <SectionsHeader>
              {courseData.sections.length > 1 ? "Sections" : ""}
            </SectionsHeader>
            <CourseSections>
              {courseData.sections.map((section, i) => (
                <SectionContainer
                  key={i}
                  waitlisted={
                    this.props.wishlist.filter(
                      course =>
                        course.registrationNumber === section.registrationNumber
                    ).length > 0
                  }
                >
                  {courseData.sections.length > 1 ? (
                    <h4 className="sectionNum">{section.code}</h4>
                  ) : (
                    ""
                  )}
                  <div className="attributes">
                    <AttributeContainer>
                      <div className="attributeLabel">Instructor</div>
                      {section.instructors.length > 1 ? "s" : ""}
                      {section.instructors.join(", ")}
                    </AttributeContainer>
                    <AttributeContainer>
                      <div className="attributeLabel">Location</div>
                      {section.location}
                    </AttributeContainer>
                    <AttributeContainer>
                      <div className="attributeLabel">Units</div>
                      {section.minUnits}-{section.maxUnits}
                    </AttributeContainer>
                    <AttributeContainer>
                      <div className="attributeLabel">Status</div>
                      {section.status}
                    </AttributeContainer>
                    <AttributeContainer>
                      <div className="attributeLabel">Type</div>
                      {section.type}
                    </AttributeContainer>
                    <AttributeContainer>
                      <div className="attributeLabel">Registration #</div>
                      {section.registrationNumber}
                    </AttributeContainer>
                    <AddButton
                      onClick={e =>
                        this.props.onToggleCourse({
                          year: this.props.year,
                          semester: this.props.semester,
                          course: section
                        })
                      }>+</AddButton>
                  </div>
                  { !courseData.sections.every(section => 
                    section.description == courseData.sections[0].description
                  ) && 
                    <p>{section.description}</p>
                  }
                  {section.meetings.map((meeting, i) => (
                    <DateContainer key={i}>
                      <div className="dayOfWeek">
                        {Moment(meeting.beginDate).format("dddd")}
                      </div>
                      <div className="timeOfDay">
                        {Moment(meeting.beginDate).format("h:mm A") +
                          Moment(meeting.beginDate)
                            .add(meeting.minutesDuration, "minutes")
                            .format(" - h:mm A")}
                      </div>
                    </DateContainer>
                  ))}
                  {/* Handle Recitations */}
                  {/* Handle Recitations */}
                </SectionContainer>
              ))}
            </CourseSections>
          </>
        )}
      </div>
    );
  }
}

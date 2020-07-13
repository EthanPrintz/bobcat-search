import React from "react";
import qs from "qs";
import styled from "styled-components";
import Moment from "moment";
import { Link } from "react-router-dom";
import { convertUnits, splitLocation, getStatusColor } from "./utils"; // eslint-disable-line no-unused-vars
import { CalendarTodayTwoTone, AddBoxTwoTone } from "@material-ui/icons";
import { green, red, grey } from "@material-ui/core/colors";
// Import major progressions
import { progressions } from "../majorProgressions"; // eslint-disable-line no-unused-vars

export default class CoursePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      params: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }),
      loading: true,
      courseData: {},
    };
  }

  componentDidMount() {
    const { school, subject, courseid } = this.state.params;
    const { year, semester } = this.props;
    fetch(
      `https://schedge.a1liu.com/${year}/${semester}/${school}/${subject}?full=true`
    )
      .then((response) => {
        if (!response.ok) {
          // handle invalid search parameters
          return;
        }
        return response.json();
      })
      .then((data) => {
        this.setState({
          courseData: data.filter((val) => val.deptCourseId === courseid)[0],
          loading: false,
        });
      })
      .catch((error) => console.error(error));
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { loading, courseData, wishlist } = this.state;
    return (
      <div>
        {loading && (
          <>
            <span>Loading...</span>
            <ColorHeader>
              <CourseHeader>
                <Link to="/" style={{ textDecoration: "none" }}>
                  <img src="./img/go-back.svg" alt="Go back" id="backButton" />
                </Link>
              </CourseHeader>
            </ColorHeader>
          </>
        )}
        {!loading && (
          <>
            <ColorHeader>
              <CourseHeader>
                <Link
                  to={`/subject?school=${courseData.subjectCode.school}&subject=${courseData.subjectCode.code}`}
                  style={{ textDecoration: "none" }}
                >
                  <img src="./img/go-back.svg" alt="Go back" id="backButton" />
                </Link>
                <div>
                  <div id="titleDepartment">
                    {courseData.subjectCode.code}-
                    {courseData.subjectCode.school}
                  </div>
                  <div id="titleName">{courseData.name}</div>
                </div>
              </CourseHeader>
            </ColorHeader>
            {/* Handle course description here if all sections have the same one */}
            <SectionsDescription>
              {courseData.description}
              {courseData.sections.every(
                (section) => section.notes === courseData.sections[0].notes
              ) && (
                <>
                  <br />
                  <br />
                  {courseData.sections[0].notes}
                </>
              )}
            </SectionsDescription>
            {courseData.sections.length > 1 ? (
              <SectionsHeader>Sections</SectionsHeader>
            ) : (
              ""
            )}
            <CourseSections>
              {courseData.sections.map((section, i) => {
                // Sort section meetings by day of week
                console.log(section.name === courseData.name);
                let sortedSectionMeetings = section.meetings.sort(
                  (a, b) =>
                    Moment(a.beginDate).format("d") -
                    Moment(b.beginDate).format("d")
                );
                // Return
                return (
                  <SectionContainer
                    key={i}
                    waitlisted={
                      this.props.wishlist.filter(
                        (course) =>
                          course.registrationNumber ===
                          section.registrationNumber
                      ).length > 0
                    }
                  >
                    {courseData.name !== section.name ? (
                      <h3 className="sectionName">{section.name}</h3>
                    ) : (
                      ""
                    )}
                    {courseData.sections.length > 1 ? (
                      <h4 className="sectionNum">{section.code}</h4>
                    ) : (
                      ""
                    )}
                    <div className="attributes">
                      <AttributeContainer>
                        <div className="attributeLabel">
                          Instructor{section.instructors.length > 1 ? "s" : ""}
                        </div>
                        {section.instructors.join(", ")}
                      </AttributeContainer>
                      <AttributeContainer>
                        <div className="attributeLabel">Building</div>
                        {splitLocation(section.location).Building}
                      </AttributeContainer>
                      {splitLocation(section.location).Room && (
                        <AttributeContainer>
                          <div className="attributeLabel">Room</div>
                          {splitLocation(section.location).Room}
                        </AttributeContainer>
                      )}
                      <AttributeContainer>
                        <div className="attributeLabel">Units</div>
                        {convertUnits(section.minUnits, section.maxUnits)}
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
                    </div>
                    {!courseData.sections.every(
                      (section) =>
                        section.notes === courseData.sections[0].notes
                    ) && (
                      <SectionDescription>{section.notes}</SectionDescription>
                    )}

                    {/* Sections with one meeting a week */}
                    {sortedSectionMeetings.length === 1 && (
                      <DateContainer>
                        <BoldedDate>
                          {Moment(sortedSectionMeetings[0].beginDate).format(
                            "dddd"
                          )}
                          s{" "}
                        </BoldedDate>
                        from{" "}
                        <BoldedDate>
                          {Moment(sortedSectionMeetings[0].beginDate).format(
                            "h:mm A"
                          )}{" "}
                        </BoldedDate>
                        to{" "}
                        <BoldedDate>
                          {Moment(sortedSectionMeetings[0].beginDate)
                            .add(
                              sortedSectionMeetings[0].minutesDuration,
                              "minutes"
                            )
                            .format("h:mm A")}
                        </BoldedDate>
                      </DateContainer>
                    )}
                    {/* Sections with two identical meetings a week */}
                    {sortedSectionMeetings.length === 2 &&
                      Moment(sortedSectionMeetings[0].beginDate).format(
                        "h:mm"
                      ) ===
                        Moment(sortedSectionMeetings[1].beginDate).format(
                          "h:mm"
                        ) &&
                      sortedSectionMeetings[0].minutesDuration ===
                        sortedSectionMeetings[1].minutesDuration && (
                        <DateContainer>
                          <BoldedDate>
                            {Moment(sortedSectionMeetings[0].beginDate).format(
                              "dddd"
                            )}
                            s{" "}
                          </BoldedDate>
                          and{" "}
                          <BoldedDate>
                            {Moment(sortedSectionMeetings[1].beginDate).format(
                              "dddd"
                            )}
                            s{" "}
                          </BoldedDate>
                          from{" "}
                          <BoldedDate>
                            {Moment(sortedSectionMeetings[0].beginDate).format(
                              "h:mm A"
                            )}{" "}
                          </BoldedDate>
                          to{" "}
                          <BoldedDate>
                            {Moment(sortedSectionMeetings[0].beginDate)
                              .add(
                                sortedSectionMeetings[0].minutesDuration,
                                "minutes"
                              )
                              .format("h:mm A")}
                          </BoldedDate>
                        </DateContainer>
                      )}
                    {/* Section with two different meetings a week */}
                    {sortedSectionMeetings.length === 2 &&
                      !(
                        Moment(sortedSectionMeetings[0].beginDate).format(
                          "h:mm"
                        ) ===
                          Moment(sortedSectionMeetings[1].beginDate).format(
                            "h:mm"
                          ) &&
                        sortedSectionMeetings[0].minutesDuration ===
                          sortedSectionMeetings[1].minutesDuration
                      ) && (
                        <DateContainer>
                          <BoldedDate>
                            {Moment(sortedSectionMeetings[0].beginDate).format(
                              "dddd"
                            )}
                            s{" "}
                          </BoldedDate>
                          from{" "}
                          <BoldedDate>
                            {Moment(sortedSectionMeetings[0].beginDate).format(
                              "h:mm A"
                            )}{" "}
                          </BoldedDate>
                          to{" "}
                          <BoldedDate>
                            {Moment(sortedSectionMeetings[0].beginDate)
                              .add(
                                sortedSectionMeetings[0].minutesDuration,
                                "minutes"
                              )
                              .format("h:mm A")}
                          </BoldedDate>
                          {" and "}
                          <BoldedDate>
                            {Moment(sortedSectionMeetings[1].beginDate).format(
                              "dddd"
                            )}
                            s{" "}
                          </BoldedDate>
                          from{" "}
                          <BoldedDate>
                            {Moment(sortedSectionMeetings[1].beginDate).format(
                              "h:mm A"
                            )}{" "}
                          </BoldedDate>
                          to{" "}
                          <BoldedDate>
                            {Moment(sortedSectionMeetings[1].beginDate)
                              .add(
                                sortedSectionMeetings[1].minutesDuration,
                                "minutes"
                              )
                              .format("h:mm A")}
                          </BoldedDate>
                        </DateContainer>
                      )}
                    {/* Sections with more than two meetings a week */}
                    {sortedSectionMeetings.length > 2 && (
                      <DateContainer>
                        {sortedSectionMeetings.map((meeting, i) => (
                          <>
                            <BoldedDate>
                              {Moment(meeting.beginDate).format("dddd")}s{" "}
                            </BoldedDate>
                            from{" "}
                            <BoldedDate>
                              {Moment(meeting.beginDate).format("h:mm A")}{" "}
                            </BoldedDate>
                            to{" "}
                            <BoldedDate>
                              {Moment(meeting.beginDate)
                                .add(meeting.minutesDuration, "minutes")
                                .format("h:mm A")}
                            </BoldedDate>
                            {i < sortedSectionMeetings.length - 1 && ", "}
                            <br />
                          </>
                        ))}
                      </DateContainer>
                    )}
                    <AddBar>
                      <CalendarButton
                        onClick={(e) =>
                          this.props.onToggleCourse({
                            year: this.props.year,
                            semester: this.props.semester,
                            course: section,
                          })
                        }
                      >
                        <CalendarTodayTwoTone
                          style={{
                            color:
                              section.status === "Open" ? green[500] : red[500],
                          }}
                        />
                        <span
                          style={{
                            color:
                              section.status === "Open" ? green[500] : red[500],
                          }}
                        >
                          {section.status === "Open"
                            ? `Add to Calendar`
                            : `Section Closed`}
                        </span>
                      </CalendarButton>
                      <CalendarButton>
                        <AddBoxTwoTone
                          style={{
                            color: grey[700],
                          }}
                        />
                        <span
                          style={{
                            color: grey[700],
                          }}
                        >
                          Add to Wishlist
                        </span>
                      </CalendarButton>
                    </AddBar>
                    {/* Handle Recitations */}
                  </SectionContainer>
                );
              })}
            </CourseSections>
          </>
        )}
      </div>
    );
  }
}

const ColorHeader = styled.div`
  width: 100vw;
  height: calc(14vmin + 5rem);
  background: linear-gradient(
    167deg,
    var(--purpleMain) 21%,
    #712991 60%,
    rgba(135, 37, 144, 1) 82%
  );
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: flex-end;
`;

const CourseHeader = styled.div`
  width: 90vw;
  margin-left: 5vw;
  background-color: var(--grey100);
  color: var(--grey800);
  padding: 3vmin 4vmin 10vmin 4%;
  border-top-left-radius: 0.8rem;
  border-top-right-radius: 0.8rem;
  box-shadow: 0 -5px 5px rgba(0, 0, 0, 0.15);
  margin-bottom: calc(-3vh - 5vmin);

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
  font-size: 1.2rem;
  line-height: 1.65rem;
  width: 73%;
  margin-left: 9%;
  color: var(--grey800);
  position: relative;
`;

const SectionsHeader = styled.div`
  font-weight: bold;
  text-align: center;
  font-size: calc(1.2vmin + 1rem);
  padding: 2vmin;
  color: var(--grey800);
  margin-top: calc(2vmin + 1rem);
`;

const AddBar = styled.div`
  padding: 0.5rem;
  height: 6vh;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const CalendarButton = styled.div`
  font-size: 1.1rem;
  height: 100%;
  width: 12rem;
  border-radius: 0.6rem;
  padding: 0.8rem 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: ${grey[200]};
  margin-right: 2rem;
  transition: 0.1s;

  :hover {
    background-color: ${grey[300]};
  }

  & > svg {
    margin-right: 0.65rem;
  }
`;

const DateContainer = styled.div`
  color: ${grey[800]};
  margin: -0.2rem 0 1rem 1rem;
  font-size: 1.25rem;
`;

const BoldedDate = styled.span`
  font-weight: bold;
`;

const SectionContainer = styled.div`
  padding: 1.8vmin 2.8vmin;
  background-color: var(--grey100);
  width: 84%;
  margin-left: 8%;
  position: relative;

  & > .sectionName {
    font-size: 1.8rem;
    font-family: var(--condensedFont);
    color: var(--grey800);
    margin-bottom: 0.25rem;
  }

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

const CourseSections = styled.div``;

const SectionDescription = styled.div`
  padding: 0 1.5rem 1.5rem 0.5rem;
  max-width: 68%;
  color: var(--grey700);
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

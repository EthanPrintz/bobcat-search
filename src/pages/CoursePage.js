import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import qs from "qs";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Attributes from "../components/Attributes";
import DateSection from "../components/DateSection";
import { CalendarButton } from "../components/CalendarButton";
import {
  convertUnits,
  splitLocation,
  changeStatus,
  styleStatus,
  parseDate,
} from "../utils"; // eslint-disable-line no-unused-vars
import {
  CalendarTodayTwoTone,
  AddBoxTwoTone,
  ExpandMoreOutlined,
} from "@material-ui/icons";
import { grey } from "@material-ui/core/colors";
// Import major progressions
import { progressions } from "../majorProgressions"; // eslint-disable-line no-unused-vars
import * as actions from "../redux/modules/wishlist";
import { Collapse } from "@material-ui/core";

function CoursePage({ year, semester, location, wishlist, wishlistCourse }) {
  const { school, subject, courseid } = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState({});
  const [expandedList, setExpandedList] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          `https://schedge.a1liu.com/${year}/${semester}/${school}/${subject}?full=true`
        );
        if (!response.ok) {
          // handle invalid search parameters
          return;
        }
        const data = await response.json();

        setCourseData(
          () => data.filter((course) => course.deptCourseId === courseid)[0]
        );
        setLoading(() => false);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [year, semester, courseid, school, subject]);

  const handleExpandList = (event, registrationNumber) => {
    event.preventDefault();
    let newLs = { ...expandedList };
    if (registrationNumber in expandedList) {
      newLs[registrationNumber] = !expandedList[registrationNumber];
    } else {
      newLs[registrationNumber] = true;
    }
    setExpandedList(newLs);
  };

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
                to={`/subject?school=${school}&subject=${subject}`}
                style={{ textDecoration: "none" }}
              >
                <img src="./img/go-back.svg" alt="Go back" id="backButton" />
              </Link>
              <div>
                <div id="titleDepartment">
                  {subject}-{school}
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
              let sortedSectionMeetings = section.meetings
                ? section.meetings.sort(
                    (a, b) =>
                      parseDate(a.beginDate).getDay() -
                      parseDate(b.beginDate).getDay()
                  )
                : [];
              return (
                <SectionContainer
                  key={i}
                  waitlisted={
                    wishlist.filter(
                      (course) =>
                        course.registrationNumber === section.registrationNumber
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
                  <Attributes
                    instructors={section.instructors}
                    building={splitLocation(section.location).Building}
                    units={convertUnits(section.minUnits, section.maxUnits)}
                    status={section.status}
                    type={section.type}
                    registrationNumber={section.registrationNumber}
                  />
                  {!courseData.sections.every(
                    (section) => section.notes === courseData.sections[0].notes
                  ) && <SectionDescription>{section.notes}</SectionDescription>}

                  <DateSection sortedSectionMeetings={sortedSectionMeetings} />
                  <UtilBar>
                    {section.recitations === undefined ||
                    section.recitations.length === 0 ? (
                      <></>
                    ) : (
                      <ExpandButton
                        style={{ cursor: "pointer" }}
                        onClick={(e) =>
                          handleExpandList(e, section.registrationNumber)
                        }
                        onKeyPress={(e) =>
                          handleExpandList(e, section.registrationNumber)
                        }
                        role="button"
                        tabIndex={0}
                      >
                        <ExpandMoreOutlined
                          style={{
                            transform: expandedList[section.registrationNumber]
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                            transition: "0.5s",
                          }}
                        ></ExpandMoreOutlined>
                        <span
                          style={{
                            color: grey[700],
                          }}
                        >
                          Show Recitations
                        </span>
                      </ExpandButton>
                    )}
                    <CalendarButton
                      onClick={() =>
                        wishlistCourse({
                          year,
                          semester,
                          course: section,
                        })
                      }
                    >
                      <CalendarTodayTwoTone
                        style={{
                          color: styleStatus(section.status),
                        }}
                      />
                      <span style={{ color: styleStatus(section.status) }}>
                        {changeStatus(section)}
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
                  </UtilBar>
                  {/* Handle Recitations */}
                  <Collapse
                    in={
                      expandedList[section.registrationNumber] === undefined
                        ? false
                        : expandedList[section.registrationNumber]
                    }
                    timeout="auto"
                    unmountOnExit
                  >
                    {section.recitations ? (
                      section.recitations.map((recitation, i) => {
                        let sortedRecitationsMeetings = recitation.meetings
                          ? recitation.meetings.sort(
                              (a, b) =>
                                parseDate(a.beginDate).getDay() -
                                parseDate(b.beginDate).getDay()
                            )
                          : [];
                        return (
                          <SectionContainer recitation={true} key={i}>
                            {courseData.name !== recitation.name ? (
                              <h3 className="sectionName">{recitation.name}</h3>
                            ) : (
                              ""
                            )}
                            {section.recitations.length >= 1 ? (
                              <h4 className="sectionNum">{recitation.code}</h4>
                            ) : (
                              ""
                            )}
                            <Attributes
                              instructors={recitation.instructors}
                              building={
                                splitLocation(recitation.location).Building
                              }
                              units={convertUnits(
                                recitation.minUnits,
                                recitation.maxUnits
                              )}
                              status={recitation.status}
                              type={recitation.type}
                              registrationNumber={recitation.registrationNumber}
                            />
                            <RecitationDescription>
                              {recitation.notes}
                            </RecitationDescription>

                            <DateSection
                              sortedSectionMeetings={sortedRecitationsMeetings}
                            />
                            <UtilBar>
                              <CalendarButton
                                onClick={() =>
                                  wishlistCourse({
                                    year,
                                    semester,
                                    course: recitation,
                                  })
                                }
                              >
                                <CalendarTodayTwoTone
                                  style={{
                                    color: styleStatus(recitation.status),
                                  }}
                                />
                                <span
                                  style={{
                                    color: styleStatus(recitation.status),
                                  }}
                                >
                                  {changeStatus(recitation)}
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
                            </UtilBar>
                          </SectionContainer>
                        );
                      })
                    ) : (
                      <> </>
                    )}
                  </Collapse>
                </SectionContainer>
              );
            })}
          </CourseSections>
        </>
      )}
    </div>
  );
}

CoursePage.propTypes = {
  year: PropTypes.number.isRequired,
  semester: PropTypes.string.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }),
  wishlist: PropTypes.arrayOf(PropTypes.object).isRequired,
  wishlistCourse: PropTypes.func.isRequired,
};

const ColorHeader = styled.div`
  width: 100vw;
  /* height: calc(14vmin + 8rem); */
  padding-top: 6rem;
  margin-top: -6rem;
  background: linear-gradient(
    167deg,
    var(--purpleMain) 21%,
    #712991 60%,
    rgba(135, 37, 144, 1) 82%
  );
  position: relative;
  display: flex;
  align-items: flex-end;
  @media (max-width: 1000px) {
    padding-top: 5rem;
  }
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
    top: 2.5vmin;
    left: 5vw;
    height: 2.5rem;
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
  padding: 1.8vmin 2.8vmin;
  font-size: 1.2rem;
  line-height: 1.65rem;
  width: 73%;
  margin-left: 9%;
  color: var(--grey800);
  position: relative;
  @media (max-width: 1000px) {
    margin-top: calc(12vmin);
  }
`;

const SectionsHeader = styled.div`
  font-weight: bold;
  text-align: center;
  font-size: calc(1.2vmin + 1rem);
  padding: 2vmin;
  color: var(--grey800);
  margin-top: calc(2vmin + 1rem);
`;

const SectionContainer = styled.div`
  padding: 1.8vmin 2.8vmin;
  background-color: var(--grey100);
  width: ${(props) => (props.recitation ? "100%" : "84%")};
  margin-left: ${(props) => (props.recitation ? "1%" : "8%")};
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

const ExpandButton = styled.div`
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

const CourseSections = styled.div``;

const SectionDescription = styled.div`
  padding: 0 1.5rem 1.5rem 0.5rem;
  max-width: 68%;
  color: var(--grey700);
`;

const RecitationDescription = styled.div`
  padding: 0 1.5rem 1.5rem 0.5rem;
  max-width: 68%;
  color: var(--grey700);
`;

const UtilBar = styled.div`
  padding: 0.5rem;
  height: 6vh;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid;
`;

const mapStateToProps = (state, props) => ({
  wishlist: state.wishlist[props.semester + props.year] || [],
  scheduled: state.scheduled[props.semester + props.year] || [],
});

export default connect(mapStateToProps, actions)(CoursePage);

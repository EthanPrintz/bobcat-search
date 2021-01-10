import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { parseDate, addMinutes, generateScheduleTime } from "../utils";
import { times, dayToStr } from "../constants";
import { CustomCheckbox } from "../components/CustomCheckbox";
import styled from "styled-components";
import SnackBar from "@material-ui/core/Snackbar";
import { grey } from "@material-ui/core/colors";

import * as actions from "../redux/modules/wishlist";
import * as courseActions from "../redux/modules/courseSelect";
import { FormControlLabel } from "@material-ui/core";

function SchedulePage({
  year,
  semester,
  wishlist,
  clearWishlist, // eslint-disable-line no-unused-vars
  wishlistCourse,
  scheduled,
  toggleCourseSelect,
}) {
  const [schedule, setSchedule] = useState({});
  const [checkboxes, setCheckboxes] = useState(
    JSON.parse(localStorage.getItem(`${year}-${semester}-checkbox-state`)) || {}
  );
  const [Toast, setToast] = useState({
    open: false,
    message: "",
    horizontal: "center",
    vertical: "top",
  });
  const { open, message, horizontal, vertical } = Toast;

  useEffect(() => {
    (async () => {
      try {
        if (wishlist.length === 0) {
          setSchedule({});
          return;
        }
        if (scheduled.length === 0) {
          setSchedule({});
          return;
        }
        const response = await fetch(
          `https://schedge.a1liu.com/${year}/${semester}/generateSchedule?registrationNumbers=${scheduled
            .map((course) => course.courseRegistrationNumber)
            .join(",")}`
        );
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        if (!data.valid) {
          setToast({
            open: true,
            message: `${data.conflictA.sectionName} & ${data.conflictB.sectionName} conflicts with one another!`, //make message more meaningful
            horizontal: "center",
            vertical: "top",
          });
          //Remove both conflicted course
          let newCheckboxes = { ...checkboxes };
          newCheckboxes[data.conflictA.registrationNumber] = false;
          newCheckboxes[data.conflictB.registrationNumber] = false;
          setCheckboxes(newCheckboxes);
          localStorage.setItem(
            `${year}-${semester}-checkbox-state`,
            JSON.stringify(newCheckboxes)
          );
          toggleCourseSelect({
            year,
            semester,
            courseRegistrationNumber: data.conflictA.registrationNumber,
          });
          toggleCourseSelect({
            year,
            semester,
            courseRegistrationNumber: data.conflictB.registrationNumber,
          });
        } else {
          setSchedule(data);
        }
        //handle layout data from schedge
      } catch (error) {
        console.error(error);
      }
    })();
  }, [year, semester, scheduled]);

  const handleOnClose = () => {
    setToast({
      open: false,
      message: "",
      horizontal: "center",
      vertical: "top",
    });
  };

  const removeCourse = (course) => {
    wishlistCourse({
      year,
      semester,
      course,
    });
    toggleCourseSelect({
      year,
      semester,
      courseRegistrationNumber: course.registrationNumber,
    });
    let newCheckboxes = { ...checkboxes };
    newCheckboxes[course.registrationNumber] = false;
    setCheckboxes(newCheckboxes);
    localStorage.setItem(
      `${year}-${semester}-checkbox-state`,
      JSON.stringify(newCheckboxes)
    );
  };

  const computeMargin = (startTime) => {
    const parsedDate = parseDate(startTime);
    return (
      (parsedDate.getHours() - 8) * 4 + (parsedDate.getMinutes() / 60) * 4 + 1
    );
  };

  const handleOnChange = (event, course, checkbox) => {
    if (event.target.checked) {
      if (!scheduled.includes(course.registrationNumber)) {
        toggleCourseSelect({
          year,
          semester,
          courseRegistrationNumber: course.registrationNumber,
        });
      }
    } else {
      toggleCourseSelect({
        year,
        semester,
        courseRegistrationNumber: course.registrationNumber,
      });
    }
    let newCheckboxes = { ...checkboxes };
    newCheckboxes[checkbox] = event.target.checked;
    setCheckboxes(newCheckboxes);
    localStorage.setItem(
      `${year}-${semester}-checkbox-state`,
      JSON.stringify(newCheckboxes)
    );
  };

  const _renderCourses = (dayNum, schedule) =>
    schedule[dayToStr[dayNum]] !== undefined &&
    Object.values(schedule[dayToStr[dayNum]]).map((course, i) => (
      <CourseBlock
        key={i}
        style={{
          height: `${(course.minutesDuration / 60) * 4}rem`,
          marginTop: `${computeMargin(course.beginDate)}rem`,
        }}
      >
        <TextContainer>
          <div className="courseCode">
            {`${course.subject.code}-${course.subject.school} ${course.deptCourseId}-${course.sectionCode}`}
          </div>
        </TextContainer>
        <div className="time">
          {`${parseDate(course.beginDate).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
              - ${addMinutes(
                parseDate(course.beginDate),
                course.minutesDuration
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}`}
        </div>
        <div className="location">{course.location}</div>
      </CourseBlock>
    ));

  return (
    <Container>
      <Calendar>
        <TimeGrid>
          {times.map((time, i) => {
            return <Time key={i}> {time} </Time>;
          })}
        </TimeGrid>
        <CourseCalendar>
          <CalendarDay>
            Monday
            {_renderCourses(1, schedule)}
          </CalendarDay>
          <CalendarDay>
            Tuesday
            {_renderCourses(2, schedule)}
          </CalendarDay>
          <CalendarDay>
            Wednesday
            {_renderCourses(3, schedule)}
          </CalendarDay>
          <CalendarDay>
            Thursday
            {_renderCourses(4, schedule)}
          </CalendarDay>
          <CalendarDay>
            Friday
            {_renderCourses(5, schedule)}
          </CalendarDay>
          {Array(65)
            .fill(1)
            .map((item, i) => {
              return <CalendarDay key={i} />;
            })}
        </CourseCalendar>
      </Calendar>
      <div
        style={{
          marginTop: "2rem",
        }}
      >
        <Header>
          <h2 className="wishlist">{`Wishlist (${wishlist.length})`}</h2>
        </Header>
        <WishlistCoursesList>
          {wishlist.length === 0 ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px",
              }}
            >
              Wishlist displayed here
            </div>
          ) : (
            wishlist.map((course, i) => {
              return (
                <WishlistCourse key={i}>
                  <WishlistTextBox>
                    <div>{course.name}</div>
                    <div>
                      Section: <span>{course.code}</span>
                    </div>
                    <div>
                      Registration No: <span>{course.registrationNumber}</span>
                    </div>
                    <div
                      style={{
                        marginTop: "1rem",
                      }}
                    >
                      <div>
                        Type: <span>{course.type}</span>
                      </div>
                      <div>
                        Instructors:{" "}
                        <span>{course.instructors.join(", ")}</span>
                      </div>
                      <div>
                        Meetings:{" "}
                        <span>{generateScheduleTime(course.meetings)}</span>
                      </div>
                    </div>
                    <WishlistUtilBox>
                      <FormControlLabel
                        value="add"
                        control={
                          <CustomCheckbox
                            checked={
                              checkboxes[course.registrationNumber] ===
                              undefined
                                ? false
                                : checkboxes[course.registrationNumber]
                            }
                            onChange={(e) =>
                              handleOnChange(
                                e,
                                course,
                                course.registrationNumber
                              )
                            }
                          >
                            {" "}
                          </CustomCheckbox>
                        }
                        label="Schedule"
                        labelPlacement="start"
                        style={{
                          margin: "0",
                          color: "black",
                          backgroundColor: "var(--grey400)",
                          borderRadius: "5px",
                          padding: "0 8px",
                          fontWeight: "bold",
                        }}
                      />
                      <div
                        role="button"
                        className="removeButton"
                        onClick={() => removeCourse(course)}
                        onKeyDown={() => removeCourse(course)}
                        tabIndex={0}
                      >
                        Remove
                      </div>
                    </WishlistUtilBox>
                  </WishlistTextBox>
                </WishlistCourse>
              );
            })
          )}
        </WishlistCoursesList>
      </div>
      <SnackBar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        message={message}
        autoHideDuration={2000}
        onClose={handleOnClose}
        key={"top center"}
      />
      {/* {wishlist.length === 0 ? (
        <span>No courses wishlisted yet!</span>
      ) : (
        <div>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => clearWishlist({ year, semester })}
            onKeyPress={() => clearWishlist({ year, semester })}
            role="button"
            tabIndex={0}
          >
            Clear Wishlist
          </div>
          {}
        </div>
      )} */}
    </Container>
  );
}

SchedulePage.propTypes = {
  year: PropTypes.number.isRequired,
  semester: PropTypes.string.isRequired,
  wishlist: PropTypes.arrayOf(PropTypes.object).isRequired,
  clearWishlist: PropTypes.func.isRequired,
  wishlistCourse: PropTypes.func.isRequired,
  scheduled: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleCourseSelect: PropTypes.func.isRequired,
};

const Container = styled.div`
  padding: 2rem 5vw;
  display: flex;
  justify-content: center;
  background-color: ${grey[200]};
`;

const Header = styled.div`
  display: flex;
  width: 100%;
  height: 3rem;
  background-color: var(--purpleMain);
  align-items: center;
  justify-content: center;

  & > .wishlist {
    font-size: 1rem;
    color: var(--grey200);
  }
`;

const WishlistCoursesList = styled.div`
  height: 100vh;
  width: 20rem;
  background-color: var(--grey200);
  overflow: scroll;
`;

const WishlistCourse = styled.div`
  min-height: 15rem;
  background-color: var(--grey300);
  border-bottom: 1px solid var(--grey200);
  border-top: 1px solid var(--grey200);
`;

const WishlistTextBox = styled.div`
  padding: 1rem;
`;

const WishlistUtilBox = styled.div`
  display: flex;
  height: 4rem;
  margin-top: 1.5rem;
  align-items: center;

  & > .removeButton {
    cursor: pointer;
    color: #bd2f2f;
    font-size: 0.9rem;
    margin-left: 1rem;
  }
`;

const Calendar = styled.div`
  min-height: 100vh;
  padding: 1rem;
  display: flex;
`;

const CourseCalendar = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, 12rem);
  grid-template-rows: 48px repeat(13, 4rem);
  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

const CalendarDay = styled.div`
  width: 100%;
  min-height: 2vh;
  padding: 15px;
  border-bottom: 1px dashed var(--grey400);
  text-align: center;
  align-items: center;

  @media (max-width: 1000px) {
    min-height: 150px;
  }
`;

const TimeGrid = styled.div`
  width: 5%;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: 40px repeat(13, 4rem);
`;

const Time = styled.div`
  text-align: right;
  font-size: 1rem;
  padding: 0 5px 0 0;
`;

const CourseBlock = styled.div`
  background-color: var(--grey400);
  width: 10rem;
  min-height: 4rem;
  padding: 5px 5px 5px 10px;
  border-radius: 10px;
  position: absolute;

  & > .time {
    font-size: 0.8rem;
    text-align: center;
    padding: 0 2px;
    width: 100%;
  }

  & > .location {
    font-size: 0.8rem;
    text-align: center;
    padding: 0 2px;
    width: 100%;
  }
`;

const TextContainer = styled.div`
  display: flex;
  justify-content: space-between;

  & > .courseCode {
    font-size: 0.9rem;
    text-align: center;
    padding: 0 2px;
    width: 100%;
  }

  & > .closeButton {
    cursor: pointer;
    &:hover {
      color: var(--grey100);
    }
  }
`;

// const CalendarWeekend = styled.div`
//   width: 100%;
//   min-height: 20vh;
//   border: 1px solid var(--grey300);
//   padding: 15px;
//   @media (max-width: 1000px) {
//     min-height: 75px;
//   }
// `;

const mapStateToProps = (state, props) => ({
  wishlist: state.wishlist[props.semester + props.year] || [],
  scheduled: state.scheduled[props.semester + props.year] || [],
});

const allActions = {
  ...actions,
  ...courseActions,
};

export default connect(mapStateToProps, allActions)(SchedulePage);

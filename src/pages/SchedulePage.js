import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { parseDate, addMinutes } from "../utils";
import { times, dayToStr } from "../constants";

import styled from "styled-components";
import SnackBar from "@material-ui/core/Snackbar";
import CheckBox from "@material-ui/core/Checkbox";
import { grey, red } from "@material-ui/core/colors";

import * as actions from "../redux/modules/wishlist";

function SchedulePage({
  year,
  semester,
  wishlist,
  clearWishlist, // eslint-disable-line no-unused-vars
  wishlistCourse,
}) {
  const [schedule, setSchedule] = useState({});
  const [scheduledRegNumbers, setScheduledRegNumbers] = useState([]);
  const [checkboxes, setCheckboxes] = useState({});
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
        if (scheduledRegNumbers.length === 0) {
          setSchedule({});
          return;
        }
        const response = await fetch(
          `https://schedge.a1liu.com/${year}/${semester}/generateSchedule?registrationNumbers=${scheduledRegNumbers.join(
            ","
          )}`
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
        } else {
          setToast({
            open: false,
            message: "",
            horizontal: "center",
            vertical: "top",
          });
          setSchedule(data);
        }
        //handle layout data from schedge
      } catch (error) {
        console.error(error);
      }
    })();
  }, [scheduledRegNumbers]);

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
    scheduledRegNumbers.filter(
      (regNumber) => regNumber !== course.registrationNumber
    );
  };

  const computeMargin = (startTime) => {
    const parsedDate = parseDate(startTime);
    return (
      (parsedDate.getHours() - 8) * 4 + (parsedDate.getMinutes() / 60) * 4 + 1
    );
  };

  const _renderCourses = (dayNum) =>
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
          <div
            role="button"
            className="closeButton"
            onClick={() => removeCourse(course)}
            onKeyDown={() => removeCourse(course)}
            tabIndex={0}
          >
            x
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

  const handleOnChange = (event, course, checkbox) => {
    if (event.target.checked) {
      if (!scheduledRegNumbers.includes(course.registrationNumber)) {
        setScheduledRegNumbers([
          ...scheduledRegNumbers,
          course.registrationNumber,
        ]);
      }
    } else {
      const newScheduledRegNumbers = scheduledRegNumbers.filter(
        (regNumber) => regNumber !== course.registrationNumber
      );
      setScheduledRegNumbers(newScheduledRegNumbers);
    }
    let newCheckboxes = { ...checkboxes };
    newCheckboxes[checkbox] = event.target.checked;
    setCheckboxes(newCheckboxes);
  };

  return (
    <Container>
      <CoursesList>
        {wishlist.map((course, i) => {
          return (
            <WishlistCourse key={i}>
              <WishlistTextBox>
                <div>{course.name}</div>
                {/* <div>{`Section: ${course.code}`}</div>
                <div>{`Registration Number: ${course.registrationNumber}`}</div>
                <div>{`Type: ${course.type}`}</div>
                <div>{`Instructors: ${course.instructors.join(",")}`}</div> */}
                <CheckBox
                  checked={checkboxes[`checkbox-${course.registrationNumber}`]}
                  onChange={(e) =>
                    handleOnChange(
                      e,
                      course,
                      `checkbox-${course.registrationNumber}`
                    )
                  }
                >
                  {" "}
                </CheckBox>
                <div
                  role="button"
                  style={{
                    cursor: "pointer",
                    color: red[700],
                  }}
                  onClick={() => removeCourse(course)}
                  onKeyDown={() => removeCourse(course)}
                  tabIndex={0}
                >
                  Remove
                </div>
              </WishlistTextBox>
            </WishlistCourse>
          );
        })}
      </CoursesList>
      <SnackBar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        message={message}
        onClose={handleOnClose}
        key={"top center"}
      />
      <Calendar>
        <TimeGrid>
          {times.map((time, i) => {
            return <Time key={i}> {time} </Time>;
          })}
        </TimeGrid>
        <CourseCalendar>
          <CalendarDay>
            Monday
            {_renderCourses(1)}
          </CalendarDay>
          <CalendarDay>
            Tuesday
            {_renderCourses(2)}
          </CalendarDay>
          <CalendarDay>
            Wednesday
            {_renderCourses(3)}
          </CalendarDay>
          <CalendarDay>
            Thursday
            {_renderCourses(4)}
          </CalendarDay>
          <CalendarDay>
            Friday
            {_renderCourses(5)}
          </CalendarDay>
          {Array(65)
            .fill(1)
            .map((item, i) => {
              return <CalendarDay key={i} />;
            })}
        </CourseCalendar>
      </Calendar>
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
};

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  background-color: ${grey[200]};
`;

const CoursesList = styled.div`
  height: 100%;
  width: 30%;
  background-color: var(--grey100);
  overflow: scroll;
`;

const WishlistCourse = styled.div`
  height: 15rem;
  width: 100%;
  background-color: var(--grey300);
  border-bottom: 1px solid var(--grey200);
  border-top: 1px solid var(--grey200);
`;

const WishlistTextBox = styled.div`
  width: 100%;
  height: 100%;
  padding: 1rem;
`;

const Calendar = styled.div`
  min-height: 100vh;
  padding: 2rem 2vw;
  width: 100%;
  margin: 4vmin auto;
  display: flex;
`;

const CourseCalendar = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 20% 20% 20% 20% 20%;
  grid-template-rows: 48px repeat(13, 4rem);
  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

const CalendarDay = styled.div`
  width: 100%;
  min-height: 2vh;
  border-bottom: 1px dashed var(--grey400);
  text-align: center;
  padding: 15px;
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
  width: 12rem;
  min-height: 4rem;
  padding: 5px 5px 5px 10px;
  border-radius: 10px;
  position: absolute;
  cursor: pointer;

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

export default connect(mapStateToProps, actions)(SchedulePage);

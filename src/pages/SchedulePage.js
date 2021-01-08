import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "styled-components";
import SnackBar from "@material-ui/core/Snackbar";
import { parseDate, addMinutes } from "../utils";
import { grey } from "@material-ui/core/colors";

import * as actions from "../redux/modules/wishlist";

function SchedulePage({
  year,
  semester,
  wishlist,
  clearWishlist,
  wishlistCourse,
}) {
  const times = [
    "",
    "8:00",
    "9:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
  ];

  const dayToStr = {
    0: "su",
    1: "mo",
    2: "tu",
    3: "we",
    4: "th",
    5: "fr",
    6: "sa",
  };

  const [schedule, setSchedule] = useState({});
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
        const registrationNumbers = [];
        wishlist.forEach((course) => {
          registrationNumbers.push(course.registrationNumber);
        });
        if (registrationNumbers.length === 0) {
          setSchedule({});
          return;
        }
        const response = await fetch(
          `https://schedge.a1liu.com/${year}/${semester}/generateSchedule?registrationNumbers=${registrationNumbers.join(
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
            message: `${data.conflictA.sectionName} & ${data.conflictB.sectionName} conflicts with one another!`,
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
        }
        //handle layout data from schedge
        setSchedule(data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [year, semester, wishlist]);

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
  };

  const _renderCourses = (dayNum) =>
    schedule[dayToStr[dayNum]] !== undefined &&
    Object.values(schedule[dayToStr[dayNum]]).map((course, i) => (
      <CourseBlock key={i}>
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

  return (
    <div
      style={{
        padding: "2rem 10vw",
        backgroundColor: grey[200],
        minHeight: "100vh",
      }}
    >
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

      {wishlist.length === 0 ? (
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
      )}
    </div>
  );
}

SchedulePage.propTypes = {
  year: PropTypes.number.isRequired,
  semester: PropTypes.string.isRequired,
  wishlist: PropTypes.arrayOf(PropTypes.object).isRequired,
  clearWishlist: PropTypes.func.isRequired,
  wishlistCourse: PropTypes.func.isRequired,
};

const Calendar = styled.div`
  width: 100%;
  margin: 4vmin auto;
  display: flex;
`;

const CourseCalendar = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 20% 20% 20% 20% 20%;
  grid-template-rows: 48px 30px 30px 30px 30px 30px 30px 30px 30px 30px 30px 30px 30px 30px;
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
  grid-template-rows: 40px 30px 30px 30px 30px 30px 30px 30px 30px 30px 30px 30px 30px 30px;
`;

const Time = styled.div`
  text-align: right;
  font-size: 1rem;
  padding: 0 5px 0 0;
`;

const CourseBlock = styled.div`
  margin-top: 1rem;
  background-color: var(--grey400);
  height: 90px;
  width: 100%;
  padding: 0 1vmin;
  position: relative;
  padding: 5px 5px 5px 10px;
  border-radius: 10px;
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

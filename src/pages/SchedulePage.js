import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "styled-components";

import * as actions from "../redux/modules/wishlist";

function SchedulePage({ year, semester, wishlist, clearWishlist }) {
  const _renderCourses = (dayNum, wishlist) =>
    wishlist
      .filter(
        (course) =>
          course.meetings.filter(
            (meeting) => new Date(meeting.beginDate).getDay() === dayNum
          ).length > 0
      )
      .map((course, i) => (
        <div key={i} style={{ marginTop: "0.5em" }}>
          <h3>{course.name}</h3>
        </div>
      ));

  return (
    <div style={{ padding: "2rem 10vw" }}>
      <CourseCalendar>
        <CalendarDay>
          Monday
          {_renderCourses(1, wishlist)}
        </CalendarDay>
        <CalendarDay>
          Tuesday
          {_renderCourses(2, wishlist)}
        </CalendarDay>
        <CalendarDay>
          Wednesday
          {_renderCourses(3, wishlist)}
        </CalendarDay>
        <CalendarDay>
          Thursday
          {_renderCourses(4, wishlist)}
        </CalendarDay>
        <CalendarDay>
          Friday
          {_renderCourses(5, wishlist)}
        </CalendarDay>
        <div>
          <CalendarWeekend>
            Saturday
            {_renderCourses(6, wishlist)}
          </CalendarWeekend>
          <CalendarWeekend>
            Sunday
            {_renderCourses(0, wishlist)}
          </CalendarWeekend>
        </div>
      </CourseCalendar>
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
};

const CourseCalendar = styled.div`
  width: 100%;
  margin: 4vmin auto;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

const CalendarDay = styled.div`
  width: 100%;
  min-height: 40vh;
  border: 1px solid var(--grey300);
  padding: 15px;
  @media (max-width: 1000px) {
    min-height: 150px;
  }
`;

const CalendarWeekend = styled.div`
  width: 100%;
  min-height: 20vh;
  border: 1px solid var(--grey300);
  padding: 15px;
  @media (max-width: 1000px) {
    min-height: 75px;
  }
`;

const mapStateToProps = (state, props) => ({
  wishlist: state.wishlist[props.semester + props.year] || [],
  scheduled: state.scheduled[props.semester + props.year] || [],
});

export default connect(mapStateToProps, actions)(SchedulePage);

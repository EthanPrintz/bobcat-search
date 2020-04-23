import React, { Component } from "react";
import styled from "styled-components";
import Moment from "moment";
import { Link } from "react-router-dom";

const CourseCalendar = styled.div`
  width: 100vw;
  height: 50vmin;
  background-color: var(--grey200);
  margin: 4vmin 0;
`;

const CalendarDay = styled.div`
  width: calc(100vw / 7);
  height: 100%;
  float: left;
  border: 1px solid var(--grey100);
`;

export default class SchedulePage extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { year, semester } = this.props;
    function renderCourses(dayNum, wishlist) {
      let renderList = [];
      return wishlist
        .filter(
          (course) =>
            new Date(course.meetings[0].beginDate).getDay() === dayNum ||
            new Date(course.meetings[1].beginDate).getDay() === dayNum
        )
        .map((course, i) => (
          <div key={i}>
            <h3>{course.name}</h3>
          </div>
        ));
    }
    return (
      <div>
        <CourseCalendar>
          <CalendarDay>
            Monday
            {renderCourses(1, this.props.wishlist)}
          </CalendarDay>
          <CalendarDay>
            Tuesday
            {renderCourses(2, this.props.wishlist)}
          </CalendarDay>
          <CalendarDay>
            Wednesday
            {renderCourses(3, this.props.wishlist)}
          </CalendarDay>
          <CalendarDay>
            Thursday
            {renderCourses(4, this.props.wishlist)}
          </CalendarDay>
          <CalendarDay>
            Friday
            {renderCourses(5, this.props.wishlist)}
          </CalendarDay>
          <CalendarDay>
            Saturday
            {renderCourses(6, this.props.wishlist)}
          </CalendarDay>
          <CalendarDay>
            Sunday
            {renderCourses(0, this.props.wishlist)}
          </CalendarDay>
        </CourseCalendar>
        {this.props.wishlist.length === 0 ? (
          <span>No courses Wishlisted yet!</span>
        ) : (
          <div>
            <div onClick={() => this.props.onClearWishlist({ year, semester })}>
              Clear Wishlist
            </div>
            {}
          </div>
        )}
      </div>
    );
  }
}

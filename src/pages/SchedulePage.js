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

  _renderCourses = (dayNum, wishlist) =>
    wishlist
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

  render() {
    const { year, semester } = this.props;
    return (
      <div>
        <CourseCalendar>
          <CalendarDay>
            Monday
            {this._renderCourses(1, this.props.wishlist)}
          </CalendarDay>
          <CalendarDay>
            Tuesday
            {this._renderCourses(2, this.props.wishlist)}
          </CalendarDay>
          <CalendarDay>
            Wednesday
            {this._renderCourses(3, this.props.wishlist)}
          </CalendarDay>
          <CalendarDay>
            Thursday
            {this._renderCourses(4, this.props.wishlist)}
          </CalendarDay>
          <CalendarDay>
            Friday
            {this._renderCourses(5, this.props.wishlist)}
          </CalendarDay>
          <CalendarDay>
            Saturday
            {this._renderCourses(6, this.props.wishlist)}
          </CalendarDay>
          <CalendarDay>
            Sunday
            {this._renderCourses(0, this.props.wishlist)}
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

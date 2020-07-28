import React, { Component } from "react";
import styled from "styled-components";
// import { Link } from 'react-router-dom';

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
        <div key={i} style={{marginTop: "0.5em"}}>
          <h3>{course.name}</h3>
        </div>
      ));


  render() {
    const { year, semester } = this.props;
    return (
      <div style={{padding: "2rem 10vw"}}>
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
          <div>
            <CalendarWeekend>
              Saturday
              {this._renderCourses(6, this.props.wishlist)}
            </CalendarWeekend>
            <CalendarWeekend>
              Sunday
              {this._renderCourses(0, this.props.wishlist)}
            </CalendarWeekend>
          </div>
        </CourseCalendar>
        {this.props.wishlist.length === 0 ? (
          <span>No courses wishlisted yet!</span>
        ) : (
          <div>
            <div style={{cursor: "pointer"}} onClick={() => this.props.onClearWishlist({ year, semester })}>
              Clear Wishlist
            </div>
            {}
          </div>
        )}
      </div>
    );
  }
}

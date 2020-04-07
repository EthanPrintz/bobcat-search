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
    // The code rendered here is just a proof of concept for the use of redux in this project.
    // It is by no means what should actually be used when the time comes.
    const { year, semester } = this.props;
    return (
      <div>
        <CourseCalendar>
          <CalendarDay></CalendarDay>
          <CalendarDay></CalendarDay>
          <CalendarDay></CalendarDay>
          <CalendarDay></CalendarDay>
          <CalendarDay></CalendarDay>
          <CalendarDay></CalendarDay>
          <CalendarDay></CalendarDay>
        </CourseCalendar>
        {this.props.wishlist.length === 0 ? (
          <span>No courses Wishlisted yet!</span>
        ) : (
          <div>
            <div onClick={() => this.props.onClearWishlist({ year, semester })}>
              Clear Wishlist
            </div>
            {this.props.wishlist.map((course, i) => (
              <div
                key={i}
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: "black",
                  borderBottomStyle: "solid"
                }}
              >
                <h3>{course.name}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

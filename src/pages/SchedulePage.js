import React, { Component } from "react";

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

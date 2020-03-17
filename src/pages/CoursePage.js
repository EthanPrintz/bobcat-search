import React from "react";
import qs from "qs";

export default class CoursePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    console.log(props);
  }

  render() {
    return (
      <div>
        <span>
          {qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).y}
        </span>
      </div>
    );
  }
}

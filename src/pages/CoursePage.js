import React from "react";
import qs from "qs";
import Moment from "moment";

export default class CoursePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      params: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }),
      loading: true,
      courseData: {}
    };
  }

  componentDidMount() {
    const { year, semester, school, subject, courseid } = this.state.params;
    fetch(`http://schedge.a1liu.com/${year}/${semester}/${school}/${subject}`)
      .then(response => {
        if (!response.ok) {
          // handle invalid search parameters
          return;
        }
        return response.json();
      })
      .then(data => {
        this.setState({
          courseData: data.filter(val => val.deptCourseId === courseid)[0],
          loading: false
        });
      })
      .catch(error => console.error(error));
  }

  render() {
    const { loading, courseData } = this.state;
    return (
      <div>
        {loading && <span>Loading...</span>}
        {!loading && (
          <>
            <h2 className="courseName">
              {courseData.subjectCode.code}-{courseData.subjectCode.school}
              &nbsp;
              {courseData.name}
            </h2>
            <h3>Sections:</h3>
            <hr />
            {courseData.sections.map((section, i) => (
              <div className="section" key={i}>
                <h4>Section {section.code}</h4>
                <p>Name: {section.name}</p>
                <p>Instructor(s): {section.instructors.join(", ")}</p>
                <p>Location: {section.location}</p>
                <p>
                  Units: {section.minUnits}-{section.maxUnits}
                </p>
                <p>Status: {section.status}</p>
                <p>Type: {section.type}</p>
                <p>Registration Number: {section.registrationNumber}</p>
                <p>Meeting Times</p>
                {section.meetings.map((meeting, i) => (
                  <p key={i}>
                    {Moment(meeting.beginDate).format("ddd h:mm") +
                      Moment(meeting.beginDate)
                        .add(meeting.minutesDuration, "minutes")
                        .format("-h:mm")}
                  </p>
                ))}
                <hr />
              </div>
            ))}
          </>
        )}
      </div>
    );
  }
}

import React, { Component } from "react";
import qs from "qs";
import styled from "styled-components";
import { Link } from "react-router-dom";

const DepartmentHeader = styled.div`
  width: 100vw;
  padding: 3vmin;
  font-size: cacl(1vmin + 1rem);
`;


export default class SchoolPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      params: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }),
      loading: true,
      schoolData: {}
    };
  }

  componentDidMount() {
    const { school } = this.state.params;

    fetch(`https://schedge.a1liu.com/subjects`)
      .then(response => {
        if (!response.ok) {
          // handle invalid search parameters
          return;
        }
        return response.json();
      })
      .then(data => {
        this.setState({ loading: false, schoolData: data[school] });
      });
  }

  render() {
    return (
      <div>
        <DepartmentHeader>
          <div id="departmentTitle">{this.state.params.school}</div>
        </DepartmentHeader>
        {this.state.loading && <span>Loading...</span>}
        {!this.state.loading && (
          <div>
            {Object.keys(this.state.schoolData).map((subjectid, i) => {
              const subject = this.state.schoolData[subjectid];
              return (
                <Link
                  to={{
                    pathname: "/subject",
                    search: `?&school=${this.state.params.school}&subject=${subjectid}`
                  }}
                  key={i}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: "black",
                      borderBottomStyle: "solid",
                      padding: 15
                    }}
                  >
                    <span>{subjectid}</span>-<span>{subject.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

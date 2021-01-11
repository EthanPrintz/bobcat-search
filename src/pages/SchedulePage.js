import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { dayToStr } from "../constants";
import WishlistCourse from "../components/WishlistCourse";
import Calendar from "../components/Calendar";
import ScheduleCourse from "../components/ScheduleCourse";

import styled from "styled-components";
import SnackBar from "@material-ui/core/Snackbar";
import { grey } from "@material-ui/core/colors";

import * as wishlistActions from "../redux/modules/wishlist";
import * as courseActions from "../redux/modules/courseSelect";

function SchedulePage({
  year,
  semester,
  wishlist,
  wishlistCourse,
  scheduled,
  toggleCourseSelect,
  clearSchedule,
}) {
  const [schedule, setSchedule] = useState({});
  const [checkboxes, setCheckboxes] = useState(
    JSON.parse(localStorage.getItem(`${year}-${semester}-checkbox-state`)) || {}
  );
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
        if (wishlist.length === 0) {
          setSchedule({});
          return;
        }
        if (scheduled.length === 0) {
          setSchedule({});
          return;
        }
        const response = await fetch(
          `https://schedge.a1liu.com/${year}/${semester}/generateSchedule?registrationNumbers=${scheduled
            .map((course) => course.courseRegistrationNumber)
            .join(",")}`
        );
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        if (!data.valid) {
          setToast({
            open: true,
            message: `${data.conflictA.sectionName} & ${data.conflictB.sectionName} conflicts with one another!`, //make message more meaningful
            horizontal: "center",
            vertical: "top",
          });
          //Remove both conflicted course
          let newCheckboxes = { ...checkboxes };
          newCheckboxes[data.conflictA.registrationNumber] = false;
          newCheckboxes[data.conflictB.registrationNumber] = false;
          setCheckboxes(newCheckboxes);
          localStorage.setItem(
            `${year}-${semester}-checkbox-state`,
            JSON.stringify(newCheckboxes)
          );
          toggleCourseSelect({
            year,
            semester,
            conflicts: [
              { courseRegistrationNumber: data.conflictA.registrationNumber },
              { courseRegistrationNumber: data.conflictB.registrationNumber },
            ],
          });
        } else {
          setSchedule(data);
        }
        //handle layout data from schedge
      } catch (error) {
        console.error(error);
      }
    })();
  }, [year, semester, scheduled]);

  const handleClearSchedule = () => {
    clearSchedule({ year, semester });
    setCheckboxes({});
    localStorage.setItem(
      `${year}-${semester}-checkbox-state`,
      JSON.stringify({})
    );
  };

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
    if (
      checkboxes[course.registrationNumber] !== undefined &&
      checkboxes[course.registrationNumber]
    ) {
      toggleCourseSelect({
        year,
        semester,
        courseRegistrationNumber: course.registrationNumber,
      });
    }
    let newCheckboxes = { ...checkboxes };
    newCheckboxes[course.registrationNumber] = false;
    setCheckboxes(newCheckboxes);
    localStorage.setItem(
      `${year}-${semester}-checkbox-state`,
      JSON.stringify(newCheckboxes)
    );
  };

  const handleOnChange = (event, course, checkbox) => {
    if (event.target.checked) {
      if (!scheduled.includes(course.registrationNumber)) {
        toggleCourseSelect({
          year,
          semester,
          courseRegistrationNumber: course.registrationNumber,
        });
      }
    } else {
      toggleCourseSelect({
        year,
        semester,
        courseRegistrationNumber: course.registrationNumber,
      });
    }
    let newCheckboxes = { ...checkboxes };
    newCheckboxes[checkbox] = event.target.checked;
    setCheckboxes(newCheckboxes);
    localStorage.setItem(
      `${year}-${semester}-checkbox-state`,
      JSON.stringify(newCheckboxes)
    );
  };

  const _renderCourses = (dayNum) =>
    schedule[dayToStr[dayNum]] !== undefined &&
    Object.values(schedule[dayToStr[dayNum]]).map((course, i) => {
      return <ScheduleCourse course={course} key={i} />;
    });

  return (
    <Container>
      <Calendar renderCourses={_renderCourses} />
      <div
        style={{
          marginTop: "2rem",
        }}
      >
        <Header>
          <h2 className="wishlist">{`Wishlist (${wishlist.length})`}</h2>
        </Header>
        <WishlistCoursesList>
          {wishlist.length === 0 ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px",
              }}
            >
              Wishlist displayed here
            </div>
          ) : (
            wishlist.map((course, i) => {
              return (
                <WishlistCourse
                  key={i}
                  year={year}
                  semester={semester}
                  course={course}
                  checkboxes={checkboxes}
                  removeCourse={removeCourse}
                  handleOnChange={handleOnChange}
                />
              );
            })
          )}
        </WishlistCoursesList>
        <ClearScheduleButton
          style={{ cursor: "pointer", marginTop: "1rem", color: "#bd2f2f" }}
          onClick={handleClearSchedule}
          onKeyPress={() => clearSchedule({ year, semester })}
          role="button"
          tabIndex={0}
        >
          Clear Schedule
        </ClearScheduleButton>
      </div>
      <SnackBar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        message={message}
        autoHideDuration={2000}
        onClose={handleOnClose}
        key={"top center"}
      />
    </Container>
  );
}

SchedulePage.propTypes = {
  year: PropTypes.number.isRequired,
  semester: PropTypes.string.isRequired,
  wishlist: PropTypes.arrayOf(PropTypes.object).isRequired,
  wishlistCourse: PropTypes.func.isRequired,
  scheduled: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleCourseSelect: PropTypes.func.isRequired,
  clearSchedule: PropTypes.func.isRequired,
};

const Container = styled.div`
  padding: 2rem 5vw;
  display: flex;
  justify-content: center;
  background-color: ${grey[200]};
`;

const Header = styled.div`
  display: flex;
  width: 100%;
  height: 3rem;
  background-color: var(--purpleMain);
  align-items: center;
  justify-content: center;

  & > .wishlist {
    font-size: 1rem;
    color: var(--grey200);
  }
`;

const WishlistCoursesList = styled.div`
  height: 100vh;
  width: 20rem;
  background-color: var(--grey200);
  overflow: scroll;
`;

const ClearScheduleButton = styled.div`
  cursor: pointer;
  margin-top: 1rem;
  color: #bd2f2f;
`;

const mapStateToProps = (state, props) => ({
  wishlist: state.wishlist[props.semester + props.year] || [],
  scheduled: state.scheduled[props.semester + props.year] || [],
});

const allActions = {
  ...wishlistActions,
  ...courseActions,
};

export default connect(mapStateToProps, allActions)(SchedulePage);

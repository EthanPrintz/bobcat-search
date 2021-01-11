import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Attributes from "./Attributes";
import DateSection from "./DateSection";
import {
  convertUnits,
  splitLocation,
  changeStatus,
  styleStatus,
} from "../utils"; // eslint-disable-line no-unused-vars
import styled from "styled-components";
import { CalendarTodayTwoTone, AddBoxTwoTone } from "@material-ui/icons";
import { grey } from "@material-ui/core/colors";
import * as actions from "../redux/modules/wishlist";

function Recitation({
  year,
  semester,
  wishlistCourse,
  recitation,
  sortedRecitationsMeetings,
  courseName,
}) {
  return (
    <RecitationContainer>
      {courseName !== recitation.name ? (
        <h3 className="sectionName">{recitation.name}</h3>
      ) : (
        ""
      )}
      <h4 className="sectionNum">{recitation.code}</h4>
      <Attributes
        instructors={recitation.instructors}
        building={splitLocation(recitation.location).Building}
        units={convertUnits(recitation.minUnits, recitation.maxUnits)}
        status={recitation.status}
        type={recitation.type}
        registrationNumber={recitation.registrationNumber}
      />
      <RecitationDescription>{recitation.notes}</RecitationDescription>

      <DateSection sortedSectionMeetings={sortedRecitationsMeetings} />
      <UtilBar>
        <CalendarButton
          onClick={() =>
            wishlistCourse({
              year,
              semester,
              course: recitation,
            })
          }
        >
          <CalendarTodayTwoTone
            style={{
              color: styleStatus(recitation.status),
            }}
          />
          <span
            style={{
              color: styleStatus(recitation.status),
            }}
          >
            {changeStatus(recitation)}
          </span>
        </CalendarButton>
        <CalendarButton>
          <AddBoxTwoTone
            style={{
              color: grey[700],
            }}
          />
          <span
            style={{
              color: grey[700],
            }}
          >
            Add to Wishlist
          </span>
        </CalendarButton>
      </UtilBar>
    </RecitationContainer>
  );
}

Recitation.propTypes = {
  year: PropTypes.number.isRequired,
  semester: PropTypes.string.isRequired,
  wishlistCourse: PropTypes.func.isRequired,
  recitation: PropTypes.object.isRequired,
  sortedRecitationsMeetings: PropTypes.array.isRequired,
  courseName: PropTypes.string.isRequired,
};

const RecitationContainer = styled.div`
  padding: 1.8vmin 2.8vmin;
  background-color: var(--grey100);
  width: 100%;
  margin-left: 1%;
  position: relative;

  & > .sectionName {
    font-size: 1.8rem;
    font-family: var(--condensedFont);
    color: var(--grey800);
    margin-bottom: 0.25rem;
  }

  & > .sectionNum {
    font-size: 1.6rem;
    font-family: var(--condensedFont);
    color: var(--grey700);
    margin: 0 0 -1rem 1rem;
  }

  & > .attributes {
    display: flex;
    flex-wrap: wrap;
  }
`;

const RecitationDescription = styled.div`
  padding: 0 1.5rem 1.5rem 0.5rem;
  max-width: 68%;
  color: var(--grey700);
`;

const UtilBar = styled.div`
  padding: 0.5rem;
  height: 6vh;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid;
`;

const CalendarButton = styled.div`
  font-size: 1.1rem;
  height: 100%;
  width: 12rem;
  border-radius: 0.6rem;
  padding: 0.8rem 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: ${grey[200]};
  margin-right: 2rem;
  transition: 0.1s;

  :hover {
    background-color: ${grey[300]};
  }

  & > svg {
    margin-right: 0.65rem;
  }
`;

const mapStateToProps = (state, props) => ({
  wishlist: state.wishlist[props.semester + props.year] || [],
  scheduled: state.scheduled[props.semester + props.year] || [],
});

export default connect(mapStateToProps, actions)(Recitation);

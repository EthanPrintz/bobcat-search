import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import styled from "styled-components";
import Drawer from "@material-ui/core/Drawer";
import grey from "@material-ui/core/colors/grey";

import { findInstructor } from "../utils";
import Table from "./Table";

export default function Attributes({
  instructors,
  building,
  room,
  units,
  status, // eslint-disable-line no-unused-vars
  type,
  registrationNumber,
}) {
  const [instructorsWithRMP, setInstructorsWithRMP] = useState([]);
  const [currentInstructor, setCurrentInstructor] = useState({
    name: "Instructor",
    rmpId: "",
    page: 1,
    ratings: [],
    isMore: false,
    overallRating: -1,
    totalRatings: 0,
  });
  const [drawer, setDrawer] = useState(false);

  const onClickInstructor = async (instructor) => {
    try {
      if (instructor.rmpId === null) {
        setDrawer(false);
        return;
      }
      const resp = await fetch(
        `https://www.ratemyprofessors.com/paginate/professors/ratings?tid=${instructor.rmpId}&page=1`
      );
      if (!resp.ok) {
        console.log(`Error ${resp.status}`);
      }
      const jsonRatings = await resp.json();
      setCurrentInstructor({
        name: instructor.name,
        rmpId: instructor.rmpId,
        page: 1,
        isMore: jsonRatings.remaining === 0 ? false : true,
        ratings: [...currentInstructor.ratings, ...jsonRatings.ratings],
        overallRating: instructor.overall,
        totalRatings: jsonRatings.remaining + jsonRatings.ratings.length,
      });
      setDrawer(true);
    } catch (e) {
      console.log(e);
    }
  };

  const onLoadMore = async () => {
    const resp = await fetch(
      `https://www.ratemyprofessors.com/paginate/professors/ratings?tid=${
        currentInstructor.rmpId
      }&page=${currentInstructor.page + 1}`
    );
    if (!resp.ok) {
      console.log(`Error ${resp.status}`);
    }
    const moreRatings = await resp.json();
    setCurrentInstructor({
      ...currentInstructor,
      isMore: moreRatings.remaining === 0 ? false : true,
      page: currentInstructor.page + 1,
      ratings: [...currentInstructor.ratings, ...moreRatings.ratings],
    });
  };

  const onClose = () => {
    setDrawer(false);
    setCurrentInstructor({
      name: "Instructor",
      rmpId: "",
      page: 1,
      ratings: [],
      isMore: false,
      overallRating: -1,
      totalRatings: 0,
    });
  };

  useEffect(() => {
    (() => {
      const modifiedInstructors = instructors.map((instructor) =>
        findInstructor(instructor)
      );
      setInstructorsWithRMP(modifiedInstructors);
    })();
  }, [instructors]);

  return (
    <div className="attributes">
      <React.Fragment>
        <Drawer anchor={"right"} open={drawer} onClose={onClose}>
          <Table
            name={currentInstructor.name}
            totalRatings={currentInstructor.totalRatings}
            overallRating={currentInstructor.overallRating}
            ratings={currentInstructor.ratings}
            isMore={currentInstructor.isMore}
            onLoadMore={onLoadMore}
          />
        </Drawer>
      </React.Fragment>
      <AttributeContainer>
        <div className="attributeLabel">
          Instructor{instructorsWithRMP.length > 1 ? "s" : ""}
        </div>
        {instructorsWithRMP.map((instructor) => {
          return (
            <InstructorName
              key={instructor.name}
              clickable={instructor.rmpId ? true : false}
              onClick={() => onClickInstructor(instructor)}
            >
              {instructor.name}
            </InstructorName>
          );
        })}
      </AttributeContainer>
      <AttributeContainer>
        <div className="attributeLabel">Building</div>
        {building}
      </AttributeContainer>
      {room && (
        <AttributeContainer>
          <div className="attributeLabel">Room</div>
          {room}
        </AttributeContainer>
      )}
      <AttributeContainer>
        <div className="attributeLabel">Units</div>
        {units}
      </AttributeContainer>
      <AttributeContainer>
        <div className="attributeLabel">Type</div>
        {type}
      </AttributeContainer>
      <AttributeContainer>
        <div className="attributeLabel">Registration #</div>
        {registrationNumber}
      </AttributeContainer>
    </div>
  );
}

Attributes.propTypes = {
  instructors: PropTypes.array.isRequired,
  building: PropTypes.string.isRequired,
  room: PropTypes.string,
  units: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  registrationNumber: PropTypes.number.isRequired,
};

const AttributeContainer = styled.div`
  padding: calc(0.8vmin + 0.8rem);
  font-size: 1.5rem;
  color: var(--grey800);
  font-weight: bold;

  & > .attributeLabel {
    font-size: 1rem;
    font-family: var(--condensedFont);
    color: var(--grey700);
  }
`;

const InstructorName = styled.div`
  cursor: ${(props) => (props.clickable ? "pointer" : "")};
  transition: 0.1s;

  :hover {
    color: ${(props) => (props.clickable ? grey[600] : "")};
  }
`;

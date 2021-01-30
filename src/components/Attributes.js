import React, { useState } from "react";
import PropTypes from "prop-types";

import styled from "styled-components";
import Drawer from "@material-ui/core/Drawer";
import grey from "@material-ui/core/colors/grey";
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
      const names = instructor.split(" ");
      const query =
        names.length >= 2
          ? names[0] + " " + names[names.length - 1]
          : instructor;
      const professorResp = await fetch(
        `https://www.ratemyprofessors.com/filter/professor/?&page=1&queryBy=schoolsid&sid=675&queryoption=TEACHER&queryBy=teacher&query=${query}`
      );
      const jsonResp = await professorResp.json();
      if (jsonResp.searchResultsTotal === 0) {
        setCurrentInstructor({
          ...currentInstructor,
          name: instructor,
        });
        setDrawer(true);
        return;
      }
      const professorInfo = jsonResp.professors[0];
      if (professorInfo.overall_rating === "N/A") {
        setCurrentInstructor({
          ...currentInstructor,
          name: instructor,
        });
        setDrawer(true);
        return;
      }
      const resp = await fetch(
        `https://www.ratemyprofessors.com/paginate/professors/ratings?tid=${professorInfo.tid}&page=1`
      );
      if (!resp.ok) {
        console.log(`Error ${resp.status}`);
      }
      const jsonRatings = await resp.json();
      setCurrentInstructor({
        name: instructor,
        rmpId: professorInfo.tid,
        page: 1,
        isMore: jsonRatings.remaining === 0 ? false : true,
        ratings: [...currentInstructor.ratings, ...jsonRatings.ratings],
        overallRating: parseFloat(professorInfo.overall_rating),
        totalRatings: professorInfo.tNumRatings,
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
          Instructor{instructors.length > 1 ? "s" : ""}
        </div>
        {instructors.map((instructor) => {
          return (
            <InstructorName
              key={instructor}
              clickable={true}
              onClick={() => onClickInstructor(instructor)}
            >
              {instructor}
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

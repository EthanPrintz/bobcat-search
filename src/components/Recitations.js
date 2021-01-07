import React, { Fragment } from "react";
import {
  convertUnits,
  splitLocation,
  changeStatus,
  styleStatus,
  parseDate,
} from "../utils"; // eslint-disable-line no-unused-vars
import Attributes from "./Attributes";
import DateSection from "./DateSection";
import { CalendarTodayTwoTone, AddBoxTwoTone } from "@material-ui/icons";
import { grey } from "@material-ui/core/colors";
import styled from "styled-components";
import { AddBar } from "./AddBar";
import { CalendarButton } from "./CalendarButton";

export default function Recitations({
  recitations,
  wishlistCourse,
  year,
  semester,
}) {
  return recitations.map((recitation, i) => {
    let sortedRecitationsMeetings = recitation.meetings
      ? recitation.meetings.sort(
          (a, b) =>
            parseDate(a.beginDate).getDay() - parseDate(b.beginDate).getDay()
        )
      : [];
    return (
      <Fragment key={i}>
        <Attributes
          instructors={recitation.instructors}
          building={splitLocation(recitation.location).Building}
          units={convertUnits(recitation.minUnits, recitation.maxUnits)}
          status={recitation.status}
          type={recitation.type}
          registrationNumber={recitation.registrationNumber}
        />
        <SectionDescription>{recitation.notes}</SectionDescription>

        <DateSection sortedSectionMeetings={sortedRecitationsMeetings} />
        <AddBar>
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
            <span style={{ color: styleStatus(recitation.status) }}>
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
        </AddBar>
      </Fragment>
    );
  });
}

const SectionDescription = styled.div`
  padding: 0 1.5rem 1.5rem 0.5rem;
  max-width: 68%;
  color: var(--grey700);
`;

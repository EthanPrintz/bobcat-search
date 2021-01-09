import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { parseDate, addMinutes, compareTime } from "../utils";
import { days } from "../constants";
import { grey } from "@material-ui/core/colors";

export default function DateSection({ sortedSectionMeetings }) {
  return (
    <>
      {/* Sections with one meeting a week */}
      {sortedSectionMeetings.length === 1 && (
        <DateContainer>
          <BoldedDate>
            {days[parseDate(sortedSectionMeetings[0].beginDate).getDay()]}s{" "}
          </BoldedDate>
          from{" "}
          <BoldedDate>
            {parseDate(sortedSectionMeetings[0].beginDate).toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            )}{" "}
          </BoldedDate>
          to{" "}
          <BoldedDate>
            {addMinutes(
              parseDate(sortedSectionMeetings[0].beginDate),
              sortedSectionMeetings[0].minutesDuration
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </BoldedDate>
        </DateContainer>
      )}
      {/* Sections with two identical meetings a week */}
      {sortedSectionMeetings.length === 2 &&
        compareTime(
          parseDate(sortedSectionMeetings[0].beginDate),
          parseDate(sortedSectionMeetings[1].beginDate)
        ) &&
        sortedSectionMeetings[0].minutesDuration ===
          sortedSectionMeetings[1].minutesDuration && (
          <DateContainer>
            <BoldedDate>
              {days[parseDate(sortedSectionMeetings[0].beginDate).getDay()]}s{" "}
            </BoldedDate>
            and{" "}
            <BoldedDate>
              {days[parseDate(sortedSectionMeetings[1].beginDate).getDay()]}s{" "}
            </BoldedDate>
            from{" "}
            <BoldedDate>
              {parseDate(sortedSectionMeetings[0].beginDate).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}{" "}
            </BoldedDate>
            to{" "}
            <BoldedDate>
              {addMinutes(
                parseDate(sortedSectionMeetings[0].beginDate),
                sortedSectionMeetings[0].minutesDuration
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </BoldedDate>
          </DateContainer>
        )}
      {/* Section with two different meetings a week */}
      {sortedSectionMeetings.length === 2 &&
        !(
          compareTime(
            parseDate(sortedSectionMeetings[0].beginDate),
            parseDate(sortedSectionMeetings[1].beginDate)
          ) &&
          sortedSectionMeetings[0].minutesDuration ===
            sortedSectionMeetings[1].minutesDuration
        ) && (
          <DateContainer>
            <BoldedDate>
              {days[parseDate(sortedSectionMeetings[0].beginDate).getDay()]}s{" "}
            </BoldedDate>
            from{" "}
            <BoldedDate>
              {parseDate(sortedSectionMeetings[0].beginDate).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}{" "}
            </BoldedDate>
            to{" "}
            <BoldedDate>
              {addMinutes(
                parseDate(sortedSectionMeetings[0].beginDate),
                sortedSectionMeetings[0].minutesDuration
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </BoldedDate>
            {" and "}
            <BoldedDate>
              {days[parseDate(sortedSectionMeetings[0].beginDate).getDay()]}s{" "}
            </BoldedDate>
            from{" "}
            <BoldedDate>
              {parseDate(sortedSectionMeetings[1].beginDate).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}{" "}
            </BoldedDate>
            to{" "}
            <BoldedDate>
              {addMinutes(
                parseDate(sortedSectionMeetings[1].beginDate),
                sortedSectionMeetings[1].minutesDuration
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </BoldedDate>
          </DateContainer>
        )}
      {/* Sections with more than two meetings a week */}
      {sortedSectionMeetings.length > 2 && (
        <DateContainer>
          {sortedSectionMeetings.map((meeting, i) => (
            <>
              <BoldedDate>
                {days[parseDate(meeting.beginDate).getDay()]}s{" "}
              </BoldedDate>
              from{" "}
              <BoldedDate>
                {parseDate(meeting.beginDate).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
              </BoldedDate>
              to{" "}
              <BoldedDate>
                {addMinutes(
                  parseDate(meeting.beginDate),
                  meeting.minutesDuration
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </BoldedDate>
              {i < sortedSectionMeetings.length - 1 && ", "}
              <br />
            </>
          ))}
        </DateContainer>
      )}
    </>
  );
}

DateSection.propTypes = {
  sortedSectionMeetings: PropTypes.array.isRequired,
};

const DateContainer = styled.div`
  color: ${grey[800]};
  margin: -0.2rem 0 1rem 1rem;
  font-size: 1.25rem;
`;

const BoldedDate = styled.span`
  font-weight: bold;
`;

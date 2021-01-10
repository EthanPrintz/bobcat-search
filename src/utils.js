import { green, red, yellow } from "@material-ui/core/colors";
import { missingPrograms, dayToStr } from "./constants";
export function convertUnits(minUnit, maxUnit) {
  if (minUnit === 0) {
    return maxUnit;
  }
  return `${minUnit} - ${maxUnit}`;
}

export function splitLocation(location) {
  if (location.includes("-") && location.includes("Room")) {
    let locations = location.split("-");
    let roomNumber = locations[1].split(":");
    return {
      Building: locations[0],
      Room: roomNumber[1],
    };
  }
  return {
    Building: location,
  };
}

export function changeStatus(section) {
  if (section.status === "Open") {
    return "Add to Calendar";
  } else if (section.status === "Closed") {
    return "Section Closed";
  } else {
    return `Waitlist (${section.waitlistTotal})`;
  }
}

export function styleStatus(status) {
  if (status === "Open") {
    return green[500];
  } else if (status === "Closed") {
    return red[500];
  } else {
    return yellow[800];
  }
}

export function parseDate(date) {
  const datePattern = /^(\d{4})-(\d{2})-(\d{2})\s(\d{1,2}):(\d{2}):(\d{2})$/;
  const [, year, month, day, rawHour, min, sec] = datePattern.exec(date);
  return new Date(
    `${year}-${month}-${day}T${("0" + rawHour).slice(-2)}:${min}:${sec}`
  );
}

export function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

export function compareTime(timeA, timeB) {
  return (
    timeA.getHours() === timeB.getHours() &&
    timeA.getMinutes() === timeB.getMinutes() &&
    timeA.getSeconds() === timeB.getSeconds()
  );
}

export function generateScheduleTime(meetings) {
  const parsedDates = [];
  meetings.forEach((meeting) => {
    parsedDates.push(parseDate(meeting.beginDate));
  });
  parsedDates.sort((a, b) => a - b);
  if (meetings.length === 1) {
    let day = dayToStr[parsedDates[0].getDay()].toUpperCase();
    let startTime = parsedDates[0].toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    let endTime = addMinutes(
      parsedDates[0],
      meetings[0].minutesDuration
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${day} ${startTime}-${endTime}`;
  } else if (
    meetings.length === 2 &&
    compareTime(parsedDates[0], parsedDates[1])
  ) {
    let firstDay = dayToStr[parsedDates[0].getDay()].toUpperCase();
    let secondDay = dayToStr[parsedDates[1].getDay()].toUpperCase();
    let startTime = parsedDates[0].toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    let endTime = addMinutes(
      parsedDates[0],
      meetings[0].minutesDuration
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${firstDay},${secondDay} ${startTime}-${endTime}`;
  }
  return ""; //for now
}

export function findSchool(school) {
  if (missingPrograms[school]) {
    return missingPrograms[school];
  }
  return "";
}

import { green, red, yellow } from "@material-ui/core/colors";

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
    return yellow[700];
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

export const days = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

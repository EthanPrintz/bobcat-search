import { combineReducers } from "redux";

import { WISHLIST_COURSE, SELECT_COURSE, UNSELECT_COURSE } from "../actions";

const initalState = {
  wishlist: {},
  scheduled: {}
};

const wishlistReducer = (state = initalState.wishlist, action) => {
  switch (action.type) {
    case WISHLIST_COURSE:
      // let { year, semester, course } = action.payload;
      if (
        state[action.payload.semester + action.payload.year] !== undefined &&
        state[action.payload.semester + action.payload.year].filter(
          course =>
            course.registrationNumber ===
            action.payload.course.registrationNumber
        ).length !== 0
      ) {
        console.log("course exists");
        // If course exists, remove it
        return {
          ...state,
          [action.payload.semester + action.payload.year]: state[
            action.payload.semester + action.payload.year
          ].filter(
            course =>
              course.registrationNumber !==
              action.payload.course.registrationNumber
          )
        };
      }

      // if we have an entry for the current semester in our waitlist get its state
      const arrSpread =
        state[action.payload.semester + action.payload.year] ?? [];
      return {
        ...state,
        [action.payload.semester + action.payload.year]: [
          action.payload.course,
          ...arrSpread
        ]
      };
    default:
      return state;
  }
};

const courseSelectReducer = (state = initalState.scheduled, action) => {
  switch (action.type) {
    case SELECT_COURSE:
      // let { year, semester,  courseRegistrationNumber, recitationRegistrationNumber } = action.payload;
      if (
        state[action.payload.semester + action.payload.year] !== undefined &&
        state[action.payload.semester + action.payload.year].filter(
          selection =>
            selection.courseRegistrationNumber ===
            action.payload.courseRegistrationNumber
        ).length !== 0
      )
        return state;

      const arrSpread =
        state[action.payload.semester + action.payload.year] ?? [];

      return {
        ...state,
        [action.payload.semester + action.payload.year]: [
          ...arrSpread,
          {
            courseeRegistrationNumber: action.payload.courseRegistrationNumber,
            recitationRegistrationNumber:
              action.payload.recitationRegistrationNumber
          }
        ]
      };
    case UNSELECT_COURSE:
      // let { year, semester, courseRegistrationNumber, recitationRegistrationNumber } = action.payload;
      return state;
    default:
      return state;
  }
};

const schedulingApp = combineReducers({
  wishlist: wishlistReducer,
  scheduled: courseSelectReducer
});

export default schedulingApp;

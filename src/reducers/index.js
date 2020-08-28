import { combineReducers } from "redux";

import {
  WISHLIST_COURSE,
  CLEAR_WISHLIST,
  TOGGLE_COURSE_SELECT,
} from "../actions";

const initalState = {
  wishlist: {},
  scheduled: {},
};

const wishlistReducer = (state = initalState.wishlist, action) => {
  switch (action.type) {
    case WISHLIST_COURSE:
      // let { year, semester, course } = action.payload;
      if (
        state[action.payload.semester + action.payload.year] !== undefined &&
        state[action.payload.semester + action.payload.year].filter(
          (course) =>
            course.registrationNumber ===
            action.payload.course.registrationNumber
        ).length !== 0
      ) {
        // If course exists, remove it
        return {
          ...state,
          [action.payload.semester + action.payload.year]: state[
            action.payload.semester + action.payload.year
          ].filter(
            (course) =>
              course.registrationNumber !==
              action.payload.course.registrationNumber
          ),
        };
      }

      // if we have an entry for the current semester in our waitlist get its state
      // eslint-disable-next-line no-case-declarations
      const arrSpread =
        state[action.payload.semester + action.payload.year] || [];
      return {
        ...state,
        [action.payload.semester + action.payload.year]: [
          action.payload.course,
          ...arrSpread,
        ],
      };
    case CLEAR_WISHLIST:
      if (
        state[action.payload.semester + action.payload.year] !== undefined &&
        state[action.payload.semester + action.payload.year].length > 0
      ) {
        return {
          ...state,
          [action.payload.semester + action.payload.year]: [],
        };
      }
      return state;
    default:
      return state;
  }
};

const courseSelectReducer = (state = initalState.scheduled, action) => {
  switch (action.type) {
    case TOGGLE_COURSE_SELECT:
      // let { year, semester,  courseRegistrationNumber, recitationRegistrationNumber } = action.payload;
      if (
        state[action.payload.semester + action.payload.year] !== undefined &&
        state[action.payload.semester + action.payload.year].filter(
          (selection) =>
            selection.courseRegistrationNumber ===
            action.payload.courseRegistrationNumber
        ).length !== 0
      ) {
        return {
          ...state,
          [action.payload.semester + action.payload.year]: state[
            action.payload.semester + action.payload.year
          ].filter(
            (course) =>
              course.courseRegistrationNumber !==
              action.payload.courseRegistrationNumber
          ),
        };
      }

      // eslint-disable-next-line no-case-declarations
      const arrSpread =
        state[action.payload.semester + action.payload.year] || [];

      return {
        ...state,
        [action.payload.semester + action.payload.year]: [
          ...arrSpread,
          {
            courseRegistrationNumber: action.payload.courseRegistrationNumber,
            recitationRegistrationNumber:
              action.payload.recitationRegistrationNumber,
          },
        ],
      };
    default:
      return state;
  }
};

const schedulingApp = combineReducers({
  wishlist: wishlistReducer,
  scheduled: courseSelectReducer,
});

export default schedulingApp;

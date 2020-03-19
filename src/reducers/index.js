import {
  WISHLIST_COURSE,
  UNWISHLIST_COURSE,
  SELECT_COURSE,
  UNSELECT_COURSE
} from "../actions";

const initalState = {
  wishlist: {},
  scheduled: {}
};

const rootReducer = (state = initalState, action) => {
  switch (action.type) {
    case WISHLIST_COURSE:
      // let { year, semester, course } = action.payload;
      if (
        state.wishlist[action.payload.semester + action.payload.year] !==
          undefined &&
        state.wishlist[action.payload.semester + action.payload.year].filter(
          course =>
            course.registrationNumber ===
            action.payload.course.registrationNumber
        ).length !== 0
      )
        return state;
      // if we have an entry for the current semester in our waitlist get its state
      const arrSpread =
        state.wishlist[action.payload.semester + action.payload.year] ?? [];
      return {
        ...state,
        wishlist: {
          ...state.wishlist,
          [action.payload.semester + action.payload.year]: [
            action.payload.course,
            ...arrSpread
          ]
        }
      };
    case UNWISHLIST_COURSE:
      if (
        state.wishlist[action.payload.semester + action.payload.year].length ===
        0
      )
        return state;
      // let { year, semester, registrationNumber } = action.payload;
      return {
        ...state,
        wishlist: {
          ...state.wishlist,
          [action.payload.semester + action.payload.year]: state.wishlist[
            action.payload.semester + action.payload.year
          ].filter(
            course =>
              course.registrationNumber !== action.payload.registrationNumber
          )
        }
      };
    case SELECT_COURSE:
      // let { year, semester,  courseRegistrationNumber, recitationRegistrationNumber } = action.payload;
      return state;
    case UNSELECT_COURSE:
      // let { year, semester, courseRegistrationNumber, recitationRegistrationNumber } = action.payload;
      return state;
    default:
      return state;
  }
};

export default rootReducer;

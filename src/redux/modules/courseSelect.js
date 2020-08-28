const TOGGLE_COURSE_SELECT = "bobcat-search/courseselect/TOGGLE_COURSE_SELECT";

const initialState = {};

export default function reducer(state = initialState, action = {}) {
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
}

export const toggleCourseSelect = (course) => ({
  type: TOGGLE_COURSE_SELECT,
  payload: course, // { year, semester, courseRegistrationNumber, recitationRegistrationNumber }
});

export const WISHLIST_COURSE = "WISHLIST_COURSE";

export const wishlistCourse = (course) => ({
  type: WISHLIST_COURSE,
  payload: course, // { year, semester, course data}
});

export const CLEAR_WISHLIST = "CLEAR_WISHLIST";

export const clearWishlist = ({ year, semester }) => ({
  type: CLEAR_WISHLIST,
  payload: { year, semester },
});

export const TOGGLE_COURSE_SELECT = "TOGGLE_COURSE_SELECT";

export const toggleCourseSelect = (course) => ({
  type: TOGGLE_COURSE_SELECT,
  payload: course, // { year, semester, courseRegistrationNumber, recitationRegistrationNumber }
});

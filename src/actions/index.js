export const WISHLIST_COURSE = "WISHLIST_COURSE";

export const wishlistCourse = course => ({
  type: WISHLIST_COURSE,
  payload: course // { year, semester, course data}
});

export const UNWISHLIST_COURSE = "UNWISHLIST_COURSE";

export const unwishlistCourse = course => ({
  type: UNWISHLIST_COURSE,
  payload: course // { year, semester, registrationNumber}
});

export const SELECT_COURSE = "SELECT_COURSE";

export const selectCourse = course => ({
  type: SELECT_COURSE,
  payload: course // { year, semester, courseRegistrationNumber, recitationRegistrationNumber }
});

export const UNSELECT_COURSE = "UNSELECT_COURSE";

export const unselectCourse = course => ({
  type: UNSELECT_COURSE,
  payload: course // { year, semester, courseRegistrationNumber, recitationRegistrationNumber }
});

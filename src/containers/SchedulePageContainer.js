import { connect } from "react-redux";
import SchedulePage from "../pages/SchedulePage";
import { clearWishlist, toggleCourseSelect } from "../actions";

const mapStateToProps = (state, props) => ({
  wishlist: state.wishlist[props.semester + props.year] || [],
  scheduled: state.scheduled[props.semester + props.year] || [],
});

const mapDispatchToProps = (dispatch) => ({
  // if recitationRegistrationNumber isn't included it is -1 (If course has recitations it must have a recitation number)
  onToggleWishlistCourse({
    year,
    semester,
    courseRegistrationNumber,
    recitationRegistrationNumber = -1,
  }) {
    dispatch(
      toggleCourseSelect({
        year,
        semester,
        courseRegistrationNumber,
        recitationRegistrationNumber,
      })
    );
  },

  onClearWishlist({ year, semester }) {
    dispatch(clearWishlist({ year, semester }));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SchedulePage);

import { connect } from "react-redux";
import CoursePage from "../pages/CoursePage";
import { wishlistCourse } from "../actions";

const mapStateToProps = (state, props) => ({
  wishlist: state.wishlist[props.semester + props.year] || [],
  scheduled: state.scheduled[props.semester + props.year] || [],
});

const mapDispatchToProps = (dispatch) => ({
  onToggleCourse({ year, semester, course }) {
    dispatch(wishlistCourse({ year, semester, course }));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CoursePage);

import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import { purple } from "@material-ui/core/colors";
import { withStyles } from "@material-ui/core/styles";

export const CustomCheckbox = withStyles({
  root: {
    color: purple[600],
    "&$checked": {
      color: purple[900],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

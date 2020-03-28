import React from "react";
import { withStyles } from "@material-ui/styles";
import styles from "../styles/styles";
import { GlobalContext } from "../Context/GlobalState";

function Wrapper(props) {
  // Global Context State
  const context = React.useContext(GlobalContext);

  // Take styles from the material ui props
  const { classes } = props;
  return (
    <div className={context.isDark ? classes.isDark : classes.isPink}>
      {props.children}
    </div>
  );
}

export default withStyles(styles)(Wrapper);

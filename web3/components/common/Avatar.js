import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  medium: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  large: {
    width: theme.spacing(13),
    height: theme.spacing(13),
  },
  xlarge: {
    width: theme.spacing(18),
    height: theme.spacing(18),
  },
}));

export default function ImageAvatars({ size, photoUrl, displayName }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {size === 0 ? (
        <Avatar alt={displayName} src={photoUrl} className={classes.small} />
      ) : size === 1 ? (
        <Avatar alt={displayName} src={photoUrl} className={classes.medium} />
      ) : size === 2 ? (
        <Avatar alt={displayName} src={photoUrl} className={classes.xlarge} />
      ) : (
        <Avatar alt={displayName} src={photoUrl} className={classes.large} />
      )}
    </div>
  );
}

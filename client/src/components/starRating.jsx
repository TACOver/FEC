import React from 'react';
import Rating from '@material-ui/lab/Rating';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: 'column',
    '& > * + *': {
      marginTop: theme.spacing(1)
    }
  }
}));

const StarRating = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Rating value={props.rating} precision={0.25} readOnly />
    </div>
  );
};

export default StarRating;
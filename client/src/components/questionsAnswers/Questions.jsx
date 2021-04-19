import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changeProductId } from '../appSlice.js';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import Question from './Question.jsx';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
}));


const Questions = props => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <div>
        <Grid>
          <Question />
          <Question />
          <Question />
          <Question />
        </Grid>
      </div>
    </Paper>
  );
};


export default Questions;

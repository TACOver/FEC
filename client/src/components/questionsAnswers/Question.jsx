/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Answers from './Answers.jsx';
import AddAModal from './AddAnswer.jsx';

import { incrementHelpfulQuestionCount } from './qaSlice.js';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.primary
  }
}));

const Question = props => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const questionId = props.question.question_id;

  const [answers] = useState(props.answers);
  const [questionHelpfulnessCount, setQuestionHelpfulnessCount] = useState(props.question.question_helpfulness);
  const [helpfulQClicked, setHelpfulQClicked] = useState(false);
  const [reported, setReported] = useState(false);

  const onReportClick = (questionId) => {
    axios.put(`http://18.219.220.111:3000/qa/questions/${questionId}/report`)
      .then(setReported(true));
  };

  return (
    <div data-testid="question" style={{ padding: '0.3em' }}>
      <Paper className={classes.paper}>
        <b>Q: {props.question.question_body}</b>
        <span style={{ float: 'right', marginTop: 0 }}>
          Helpful? &nbsp;
          {!helpfulQClicked ?
            <u
              data-testid="helpful-question"
              className="clickable"
              onClick={() => {
                dispatch(incrementHelpfulQuestionCount(questionId));
                setQuestionHelpfulnessCount(questionHelpfulnessCount + 1);
                setHelpfulQClicked(true);
              }}>Yes
            </u> : <span data-testid="marked-helpful-question">&nbsp;</span>}
            ({questionHelpfulnessCount}) &nbsp; | &nbsp;
          <u style={{ display: 'inline-block' }}>
            <AddAModal
              questionId={questionId}
              question={props.question.question_body}/>
          </u>
            &nbsp; | &nbsp;

          {!reported ?
            <u
              className="clickable"
              onClick={() => onReportClick(questionId)}
            >Report
            </u> : 'Reported!'}
        </span>
        <div>
          <Answers answers={answers} index={props.index}/>
        </div>
      </Paper>
    </div>
  );
};

export default Question;

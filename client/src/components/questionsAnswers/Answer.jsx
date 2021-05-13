/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { incrementHelpfulAnswerCount } from './qaSlice';

const Answer = (props) => {
  const dispatch = useDispatch();

  const [answerHelpfulnessCount, setAnswerHelpfulnessCount] = useState(props.answer.helpfulness);
  const [helpfulAClicked, setHelpfulAClicked] = useState(false);
  const [reported, setReported] = useState(false);

  const onReportClick = (answerId) => {
    axios.put(`http://18.219.220.111:3000/qa/answers/${answerId}/report`)
      .then(setReported(true));
  };

  return (
    <div data-testid="answer" style={{ marginLeft: 10 }}>
      <br />
      <b>A:</b> {props.answer.body}
      <br />
      <span style={{ fontSize: 11 }}>
        by {props.answer.answerer_name === 'Seller' ?
          <b>Seller</b> : props.answer.answerer_name} &nbsp;
        {new Date(props.answer.date).toString().slice(3, 16)}
        &nbsp; | &nbsp; Helpful? &nbsp;
        {!helpfulAClicked ?
          <u
            className="clickable"
            onClick={() => {
              dispatch(incrementHelpfulAnswerCount(props.answer._id));
              setAnswerHelpfulnessCount(answerHelpfulnessCount + 1);
              setHelpfulAClicked(true);
            }}>Yes
          </u> : <span>&nbsp;</span>}
          ({answerHelpfulnessCount}) &nbsp; | &nbsp;
        {!reported ?
          <u className="clickable"
            onClick={() => onReportClick(props.answer._id)}
          >Report
          </u> : 'Reported'}
      </span>
    </div>
  );
};


export default Answer;

/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import Answer from './Answer.jsx';
import { Grid } from '@material-ui/core/';
import { useDispatch } from 'react-redux';

import { countShowMoreAnswersClick } from '../appSlice.js';

const Answers = (props) => {
  const [answers] = useState(props.answers[props.index]);
  let sortedAnswers = answers.slice().sort((a, b) => {
    return b.helpfulness - a.helpfulness;
  });

  const [moreAnswersClicked, setMoreAnswersClicked] = useState(false);

  const dispatch = useDispatch();
  const onMoreAnswersClick = () => {
    setMoreAnswersClicked(!moreAnswersClicked);
  };

  if (!moreAnswersClicked) {
    return (
      <>
        <Grid
          style={{ marginLeft: 10 }}>
          {sortedAnswers.map((answer, index) => {
            if (index < 2) {
              return (
                <Answer
                  key={answer._id}
                  answer={answer}
                  index={index}/>
              );
            }
          })}
        </Grid>
        <div style={{ textAlign: 'center' }}>
          <button
            aria-label="load more answers"
            onClick={() => {
              onMoreAnswersClick();
              dispatch(countShowMoreAnswersClick());
            }}
            style={{ border: 'none',
              backgroundColor: 'white',
              color: '#777777',
              marginTop: 5 }}>
            <u
              className="clickable"
              style={{ fontSize: 12 }}>Show more answers</u>
          </button>
        </div>
      </>
    );
  } else {
    return (
      <>
        <Grid style={{
          maxHeight: '50vh',
          boxSizing: 'border-box',
          padding: '1em',
          overflowX: 'hidden',
          overflowY: 'auto' }}>
          {sortedAnswers.map((answer, index) => {
            return <Answer key={answer._id} answer={answer} index={index}/>;
          })}
        </Grid>
        <div style={{ textAlign: 'center' }}>
          <button
            aria-label="load more answers"
            onClick={onMoreAnswersClick}
            style={{ border: 'none',
              backgroundColor: 'white',
              color: '#777777' }}>
            <u>collapse answers</u>
          </button>
        </div>
      </>
    );
  }
};

export default Answers;

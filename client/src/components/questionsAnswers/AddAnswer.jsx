/* eslint-disable react/prop-types */
import React, { useState } from "react";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { makeStyles } from "@material-ui/core/styles";
import { Button } from '@material-ui/core/';
import { ButtonGroup } from '@material-ui/core/';
import Modal from "@material-ui/core/Modal";

import { fetchQuestions } from './qaSlice.js';
import { onAnswerSubmit } from './qaSlice.js';

function getModalStyle () {
  return {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'right',
    outline: 0
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: '20%',
    margin: '0 auto',
    width: 370,
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #333333",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}));

export default function AddAModal ({ question }) {
  const classes = useStyles();

  const dispatch = useDispatch();
  const productName = useSelector(state => state.app.productInfo.name);
  const productId = useSelector(state => state.app.productId);
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [answer, setAnswer] = useState('');
  const [images] = useState([]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    if (e.target.name === 'nickname') {
      setNickname(e.target.value);
      return;
    }
    if (e.target.name === 'email') {
      setEmail(e.target.value);
      return;
    }
    if (e.target.name === 'answer') {
      setAnswer(e.target.value);
      return;
    }
  };

  const onSubmitClick = (questionId) => {
    if (answer.length && nickname.length && email.length) {
      axios.post(`/api/?endpoint=qa/questions/${questionId}/answers`, {
        body: answer,
        name: nickname,
        email: email,
        photos: images
      })
        .then(() => dispatch(onAnswerSubmit()))
        .then(() => dispatch(fetchQuestions(productId)))
        .then(
          setEmail(''),
          setAnswer(''),
          setNickname(''),
          handleClose()
        )
        .catch(error => {
          console.log(error.status);
        });
    } else {
      // eslint-disable-next-line no-alert
      alert('Whoops! Ensure no fields are left blank and that you have provided a valid email address.');
    }
  };

  const body = (
    <div
      style={modalStyle}
      className={classes.paper}>
      <h2
        id="ask-a-question-modal"
        style={{ textAlign: 'center', marginBottom: -10 }}>Submit Your Answer
      </h2>
      <h3 style={{ textAlign: 'center' }}>{`${productName}: ${question}`}</h3>
      <p style={{ textAlign: 'center' }}>(all fields required)</p>
      <form onChange={handleInputChange}>
        Your Nickname: <input
          name="nickname"
          placeholder="Example: jack543!"
          maxLength="60"
          style={{ width: 200 }}/>
        <p style={{ fontSize: 11, textAlign: 'center' }}>
          For privacy reasons, do not use your full name or email address.
        </p>
        <br/>
        Your Email: <input
          name="email"
          placeholder="Example: jack@email.com"
          maxLength="60"
          style={{ width: 200 }}/>
        <p style={{ fontSize: 11, textAlign: 'center' }}>
          For authentication reasons, you will not be emailed.
        </p>
        <br/>
        Your Answer:
        <textarea
          style={{ height: 200, width: 200, float: 'right' }}
          wrap="soft"
          name="answer"/>
        <br/>
        <br/>
        <ButtonGroup style={{ display: 'inline-flex' }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => {
            onSubmitClick(props.questionId,
              dispatch(fetchQuestions));
          }}>Submit</Button>
        </ButtonGroup>
      </form>
    </div>
  );

  return (
    <div>
      <button
        className="clickable"
        data-testid="addAnswerButton"
        onClick={handleOpen}
        style={{ border: 'none',
          backgroundColor: 'white',
          color: '#777777' }}>
        <u>Add Answer</u>
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}

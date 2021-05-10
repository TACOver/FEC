/* eslint-disable no-alert */
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { makeStyles } from "@material-ui/core/styles";
import { Button } from '@material-ui/core/';
import { ButtonGroup } from '@material-ui/core/';
import Modal from "@material-ui/core/Modal";
import AddIcon from '@material-ui/icons/Add';
import Rating from '@material-ui/lab/Rating';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { fetchReviewsNewest, fetchReviewsHelpful, fetchReviewsRelevant } from '../appSlice.js';

import Badge from '@material-ui/core/Badge';
import ImageUploading from 'react-images-uploading';

function getModalStyle () {
  return {
    display: 'flex',
    flexDirection: 'column',
    width: '70%',
    outline: 0,
    position: 'absolute',
    top: '10%',
    left: '15%',
    overflow: 'scroll',
    height: '80%'
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 600,
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #333333",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}));

export default function AddReviewModal () {
  const classes = useStyles();
  const dispatch = useDispatch();
  const sort = useSelector((state) => state.reviews.sortBy.value);
  const productId = useSelector((state) => state.app.productId);
  const productInfo = useSelector((state) => state.app.productInfo);
  const reviewMetadata = useSelector((state) => state.app.reviewMetadata);
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [overallRating, setRating] = useState(0);
  const [recommended, setRecommended] = useState('yes');
  const [size, setSize] = useState(0);
  const [width, setWidth] = useState(0);
  const [comfort, setComfort] = useState(0);
  const [quality, setQuality] = useState(0);
  const [length, setLength] = useState(0);
  const [fit, setFit] = useState(0);
  const [reviewSummary, setReviewSummary] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [characteristics, setCharacteristics] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitSucceeded, setSubmitSucceeded] = useState(false);

  const getCharacteristics = () => {
    let currentCharacteristics = {};
    Object.keys(reviewMetadata.characteristics).forEach(c => {
      let key = reviewMetadata.characteristics[c].id;
      let val = Number(Math.round(reviewMetadata.characteristics[c].value));
      currentCharacteristics[key] = val;
    });
    setCharacteristics(currentCharacteristics);
  };
  // Image Upload
  const [images, setImages] = useState([]);
  const maxNumber = 5;
  // var imgURLs = [];

  const onChangeImage = (imageList) => {
    setImages(imageList);
  };

  const handleClose = () => {
    setOpen(false);
    if (sort === 'newest') {
      dispatch(fetchReviewsNewest(productId));
    } else if (sort === 'relevant') {
      dispatch(fetchReviewsRelevant(productId));
    } else if (sort === 'helpful') {
      dispatch(fetchReviewsHelpful(productId));
    }
  };

  useEffect(() => {
    if (submitted) {
      let recc;
      if (reviewBody.length && nickname.length && email.length) {
        if (recommended === 'yes') {
          recc = true;
        } else {
          recc = false;
        }

        // imgURLs = images.map(img => img.data_url);
        // console.log(`Img urls: ${imgURLs}`);

        axios.post(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-bld/reviews`, {
          product_id: productId,
          rating: overallRating,
          summary: reviewSummary,
          body: reviewBody,
          recommend: recc,
          name: nickname,
          email: email,
          photos: [],
          characteristics: characteristics
        })
          .then(
            setRating(0),
            setRecommended(false),
            setNickname(''),
            setEmail(''),
            setFit(0),
            setLength(0),
            setSize(0),
            setWidth(0),
            setComfort(0),
            setQuality(0),
            setReviewSummary(''),
            setReviewBody(''),
            handleClose(),
            setSubmitSucceeded(true)
          )
          .catch(error => {
            console.log('error!', error);
          });
      } else {
        alert('Whoops! Ensure all required fields are not blank and that you have provided a valid email address.');
      }
      return;
    }
  }, [submitted]);


  let ratingToolTip;

  if (overallRating === 1) {
    ratingToolTip = 'Poor';
  } else if (overallRating === 2) {
    ratingToolTip = 'Fair';
  } else if (overallRating === 3) {
    ratingToolTip = 'Average';
  } else if (overallRating === 4) {
    ratingToolTip = 'Good';
  } else if (overallRating === 5) {
    ratingToolTip = 'Great';
  }


  const handleChangeRecommended = (event) => {
    setRecommended(event.target.value);
  };

  const handleChangeSize = (event) => {
    setSize(event.target.value);
  };

  const handleChangeWidth = (event) => {
    setWidth(event.target.value);
  };

  const handleChangeComfort = (event) => {
    setComfort(event.target.value);
  };

  const handleChangeQuality = (event) => {
    setQuality(event.target.value);
  };

  const handleChangeLength = (event) => {
    setLength(event.target.value);
  };

  const handleChangeFit = (event) => {
    setFit(event.target.value);
  };

  const handleReviewBody = (event) => {
    setReviewBody(event.target.value);
  };

  const handleReviewSummary = (event) => {
    setReviewSummary(event.target.value);
  };

  const handleNickname = (event) => {
    setNickname(event.target.value);
  };

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const onSubmitClick = () => {
    getCharacteristics();
    setSubmitted(true);
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h1>Write Your Review</h1>
      <h3>About {productInfo.name}</h3>
      <FormControl>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <FormLabel required>Overall Rating</FormLabel>
          </Grid>
          <Grid item>
            <Rating
              name="overallRating"
              defaultValue={0}
              value={overallRating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
              precision={1}
              emptyIcon={<StarBorderIcon fontSize="inherit" />}
            />
          </Grid>
          <Grid item>
            <span>{ratingToolTip}</span>
          </Grid>
        </Grid>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <FormLabel required>Do you recommend this product?</FormLabel>
          </Grid>
          <Grid item>
            <RadioGroup row name="recommended" value={recommended} onChange={handleChangeRecommended}>
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </Grid>
        </Grid>

        <Grid container spacing={1} alignItems="center">
          <Grid item xs={2}>
            <FormLabel required>Size?</FormLabel>
          </Grid>
          <Grid item container xs={10}>
            <Grid container item xs={2}>
              <Grid item xs={12} >
                <Box component="span" visibility="hidden">''</Box>
              </Grid>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                <Radio checked={size === '1'} value="1" name="size" onChange={handleChangeSize}/>
              </Grid>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                A size too small
              </Grid>
            </Grid>
            <Grid container item xs={2}>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                <Box component="span" visibility={size === "2" ? "visible" : "hidden"}>
                   ½ a size too small
                </Box>
              </Grid>
              <Grid item container alignContent="stretch" alignItems="center" justify="center">
                <Radio checked={size === '2'} value="2" name="size" onChange={handleChangeSize}/>
              </Grid>
              <Grid item xs={12}>
                <Box component="span" visibility="hidden">''</Box>
              </Grid>
            </Grid>
            <Grid container item xs={2}>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                <Box component="span" visibility={size === "3" ? "visible" : "hidden"}>
                   Perfect
                </Box>
              </Grid>
              <Grid item container alignContent="stretch" alignItems="center" justify="center">
                <Radio checked={size === '3'} value="3" name="size" onChange={handleChangeSize}/>
              </Grid>
              <Grid item xs={12}>
                <Box component="span" visibility="hidden">''</Box>
              </Grid>
            </Grid>
            <Grid container item xs={2}>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                <Box component="span" visibility={size === "4" ? "visible" : "hidden"}>
                   ½ a size too big
                </Box>
              </Grid>
              <Grid item container alignContent="stretch" alignItems="center" justify="center">
                <Radio checked={size === '4'} value="4" name="size" onChange={handleChangeSize}/>
              </Grid>
              <Grid item xs={12}>
                <Box component="span" visibility="hidden">''</Box>
              </Grid>
            </Grid>
            <Grid container item xs={2}>
              <Grid item xs={12}>
                <Box component="span" visibility="hidden">''</Box>
              </Grid>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                <Radio checked={size === '5'} value="5" name="size" onChange={handleChangeSize}/>
              </Grid>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                A size too big
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container spacing={1} alignItems="center">
          <Grid item xs={2}>
            <FormLabel required>Width?</FormLabel>
          </Grid>
          <Grid item container xs={10}>
            <Grid container item xs={2}>
              <Grid item xs={12} >
                <Box component="span" visibility="hidden">''</Box>
              </Grid>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                <Radio checked={width === '1'} value="1" name="width" onChange={handleChangeWidth}/>
              </Grid>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                Too narrow
              </Grid>
            </Grid>
            <Grid container item xs={2}>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                <Box component="span" visibility={width === "2" ? "visible" : "hidden"}>
                   Slightly narrow
                </Box>
              </Grid>
              <Grid item container alignContent="stretch" alignItems="center" justify="center">
                <Radio checked={width === '2'} value="2" name="width" onChange={handleChangeWidth}/>
              </Grid>
              <Grid item xs={12}>
                <Box component="span" visibility="hidden">''</Box>
              </Grid>
            </Grid>
            <Grid container item xs={2}>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                <Box component="span" visibility={width === "3" ? "visible" : "hidden"}>
                   Perfect
                </Box>
              </Grid>
              <Grid item container alignContent="stretch" alignItems="center" justify="center">
                <Radio checked={width === '3'} value="3" name="width" onChange={handleChangeWidth}/>
              </Grid>
              <Grid item xs={12}>
                <Box component="span" visibility="hidden">''</Box>
              </Grid>
            </Grid>
            <Grid container item xs={2}>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                <Box component="span" visibility={width === "4" ? "visible" : "hidden"}>
                   Slightly wide
                </Box>
              </Grid>
              <Grid item container alignContent="stretch" alignItems="center" justify="center">
                <Radio checked={width === '4'} value="4" name="width" onChange={handleChangeWidth}/>
              </Grid>
              <Grid item xs={12}>
                <Box component="span" visibility="hidden">''</Box>
              </Grid>
            </Grid>
            <Grid container item xs={2}>
              <Grid item xs={12}>
                <Box component="span" visibility="hidden">''</Box>
              </Grid>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                <Radio checked={width === '5'} value="5" name="width" onChange={handleChangeWidth}/>
              </Grid>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                Too wide
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container spacing={1} alignItems="center">
          <Grid item xs={2}>
            <FormLabel required>Comfort?</FormLabel>
          </Grid>
          <Grid item container xs={10}>
            <Grid container item xs={2}>
              <Grid item xs={12} >
                <Box component="span" visibility="hidden">''</Box>
              </Grid>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                <Radio checked={comfort === '1'} value="1" name="comfort" onChange={handleChangeComfort}/>
              </Grid>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                Uncomfortable
              </Grid>
            </Grid>
            <Grid container item xs={2}>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                <Box component="span" visibility={comfort === "2" ? "visible" : "hidden"}>
                   Slightly uncomfortable
                </Box>
              </Grid>
              <Grid item container alignContent="stretch" alignItems="center" justify="center">
                <Radio checked={comfort === '2'} value="2" name="comfort" onChange={handleChangeComfort}/>
              </Grid>
              <Grid item xs={12}>
                <Box component="span" visibility="hidden">''</Box>
              </Grid>
            </Grid>
            <Grid container item xs={2}>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                <Box component="span" visibility={comfort === "3" ? "visible" : "hidden"}>
                   Ok
                </Box>
              </Grid>
              <Grid item container alignContent="stretch" alignItems="center" justify="center">
                <Radio checked={comfort === '3'} value="3" name="comfort" onChange={handleChangeComfort}/>
              </Grid>
              <Grid item xs={12}>
                <Box component="span" visibility="hidden">''</Box>
              </Grid>
            </Grid>
            <Grid container item xs={2}>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                <Box component="span" visibility={comfort === "4" ? "visible" : "hidden"}>
                   Comfortable
                </Box>
              </Grid>
              <Grid item container alignContent="stretch" alignItems="center" justify="center">
                <Radio checked={comfort === '4'} value="4" name="comfort" onChange={handleChangeComfort}/>
              </Grid>
              <Grid item xs={12}>
                <Box component="span" visibility="hidden">''</Box>
              </Grid>
            </Grid>
            <Grid container item xs={2}>
              <Grid item xs={12}>
                <Box component="span" visibility="hidden">''</Box>
              </Grid>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                <Radio checked={comfort === '5'} value="5" name="comfort" onChange={handleChangeComfort}/>
              </Grid>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                Perfect
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container spacing={1} alignItems="center">
          <Grid item xs={2}>
            <FormLabel required>Quality?</FormLabel>
          </Grid>
          <Grid item container xs={10}>
            <Grid container item xs={2}>
              <Grid item xs={12} >
                <Box component="span" visibility="hidden">''</Box>
              </Grid>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                <Radio checked={quality === '1'} value="1" name="quality" onChange={handleChangeQuality}/>
              </Grid>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                Poor
              </Grid>
            </Grid>
            <Grid container item xs={2}>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                <Box component="span" visibility={quality === "2" ? "visible" : "hidden"}>
                   Below average
                </Box>
              </Grid>
              <Grid item container alignContent="stretch" alignItems="center" justify="center">
                <Radio checked={quality === '2'} value="2" name="quality" onChange={handleChangeQuality}/>
              </Grid>
              <Grid item xs={12}>
                <Box component="span" visibility="hidden">''</Box>
              </Grid>
            </Grid>
            <Grid container item xs={2}>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                <Box component="span" visibility={quality === "3" ? "visible" : "hidden"}>
                   As expected
                </Box>
              </Grid>
              <Grid item container alignContent="stretch" alignItems="center" justify="center">
                <Radio checked={quality === '3'} value="3" name="quality" onChange={handleChangeQuality}/>
              </Grid>
              <Grid item xs={12}>
                <Box component="span" visibility="hidden">''</Box>
              </Grid>
            </Grid>
            <Grid container item xs={2}>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                <Box component="span" visibility={quality === "4" ? "visible" : "hidden"}>
                   Pretty great
                </Box>
              </Grid>
              <Grid item container alignContent="stretch" alignItems="center" justify="center">
                <Radio checked={quality === '4'} value="4" name="quality" onChange={handleChangeQuality}/>
              </Grid>
              <Grid item xs={12}>
                <Box component="span" visibility="hidden">''</Box>
              </Grid>
            </Grid>
            <Grid container item xs={2}>
              <Grid item xs={12}>
                <Box component="span" visibility="hidden">''</Box>
              </Grid>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                <Radio checked={quality === '5'} value="5" name="quality" onChange={handleChangeQuality}/>
              </Grid>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                Perfect
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container spacing={1} alignItems="center">
          <Grid item xs={2}>
            <FormLabel required>Length?</FormLabel>
          </Grid>
          <Grid item container xs={10}>
            <Grid container item xs={2}>
              <Grid item xs={12} >
                <Box component="span" visibility="hidden">''</Box>
              </Grid>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                <Radio checked={length === '1'} value="1" name="length" onChange={handleChangeLength}/>
              </Grid>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                Runs short
              </Grid>
            </Grid>
            <Grid container item xs={2}>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                <Box component="span" visibility={length === "2" ? "visible" : "hidden"}>
                   Slightly short
                </Box>
              </Grid>
              <Grid item container alignContent="stretch" alignItems="center" justify="center">
                <Radio checked={length === '2'} value="2" name="length" onChange={handleChangeLength}/>
              </Grid>
              <Grid item xs={12}>
                <Box component="span" visibility="hidden">''</Box>
              </Grid>
            </Grid>
            <Grid container item xs={2}>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                <Box component="span" visibility={length === "3" ? "visible" : "hidden"}>
                   Perfect
                </Box>
              </Grid>
              <Grid item container alignContent="stretch" alignItems="center" justify="center">
                <Radio checked={length === '3'} value="3" name="length" onChange={handleChangeLength}/>
              </Grid>
              <Grid item xs={12}>
                <Box component="span" visibility="hidden">''</Box>
              </Grid>
            </Grid>
            <Grid container item xs={2}>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                <Box component="span" visibility={length === "4" ? "visible" : "hidden"}>
                   Slightly long
                </Box>
              </Grid>
              <Grid item container alignContent="stretch" alignItems="center" justify="center">
                <Radio checked={length === '4'} value="4" name="length" onChange={handleChangeLength}/>
              </Grid>
              <Grid item xs={12}>
                <Box component="span" visibility="hidden">''</Box>
              </Grid>
            </Grid>
            <Grid container item xs={2}>
              <Grid item xs={12}>
                <Box component="span" visibility="hidden">''</Box>
              </Grid>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                <Radio checked={length === '5'} value="5" name="length" onChange={handleChangeLength}/>
              </Grid>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                Runs long
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container spacing={1} alignItems="center">
          <Grid item xs={2}>
            <FormLabel required>Fit?</FormLabel>
          </Grid>
          <Grid item container xs={10}>
            <Grid container item xs={2}>
              <Grid item xs={12} >
                <Box component="span" visibility="hidden">''</Box>
              </Grid>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                <Radio checked={fit === '1'} value="1" name="fit" onChange={handleChangeFit}/>
              </Grid>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                Runs tight
              </Grid>
            </Grid>
            <Grid container item xs={2}>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                <Box component="span" visibility={fit === "2" ? "visible" : "hidden"}>
                   Slightly tight
                </Box>
              </Grid>
              <Grid item container alignContent="stretch" alignItems="center" justify="center">
                <Radio checked={fit === '2'} value="2" name="fit" onChange={handleChangeFit}/>
              </Grid>
              <Grid item xs={12}>
                <Box component="span" visibility="hidden">''</Box>
              </Grid>
            </Grid>
            <Grid container item xs={2}>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                <Box component="span" visibility={fit === "3" ? "visible" : "hidden"}>
                   Perfect
                </Box>
              </Grid>
              <Grid item container alignContent="stretch" alignItems="center" justify="center">
                <Radio checked={fit === '3'} value="3" name="fit" onChange={handleChangeFit}/>
              </Grid>
              <Grid item xs={12}>
                <Box component="span" visibility="hidden">''</Box>
              </Grid>
            </Grid>
            <Grid container item xs={2}>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                <Box component="span" visibility={fit === "4" ? "visible" : "hidden"}>
                   Slightly loose
                </Box>
              </Grid>
              <Grid item container alignContent="stretch" alignItems="center" justify="center">
                <Radio checked={fit === '4'} value="4" name="fit" onChange={handleChangeFit}/>
              </Grid>
              <Grid item xs={12}>
                <Box component="span" visibility="hidden">''</Box>
              </Grid>
            </Grid>
            <Grid container item xs={2}>
              <Grid item xs={12}>
                <Box component="span" visibility="hidden">''</Box>
              </Grid>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                <Radio checked={fit === '5'} value="5" name="fit" onChange={handleChangeFit}/>
              </Grid>
              <Grid item xs={12} container alignContent="stretch" alignItems="center" justify="center">
                Runs loose
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <br/>
        <FormLabel>Review Summary</FormLabel>
        <TextField
          onChange={handleReviewSummary}
          id="reviewSummary"
          label="Review summary"
          placeholder="Example: Best purchase ever!"
          variant="outlined"
          style={{ marginTop: 8 }}
          inputProps={{
            maxLength: 60
          }}/>
        <br/>
        <FormLabel required>Review Body</FormLabel>
        <TextField
          onChange={handleReviewBody}
          id="reviewBody"
          label="Review body"
          placeholder="Why did you like the product or not?"
          style={{ marginTop: 8 }}
          variant="outlined"
          value={reviewBody}
          multiline
          inputProps={{
            maxLength: 1000
          }}/>
        {reviewBody.length < 50 ?
          <div>Minimum required characters left:{50 - reviewBody.length}</div> :
          <div>Minimum reached</div>}
        <br/>

        {/* IMAGE UPLOADING */}
        <div className="image-upload-wrapper">
          <ImageUploading
            multiple
            value={images}
            onChange={onChangeImage}
            maxNumber={maxNumber}
            dataURLKey="data_url">
            {({ imageList, onImageUpload, onImageRemoveAll, onImageRemove }) => (
              <div >
                <Button variant="outlined" onClick={onImageUpload}>
              Upload Photo
                </Button>
            &nbsp;
                <Button
                  variant="outlined"
                  onClick={onImageRemoveAll}
                  color="secondary">
              Remove All
                </Button>
                <div
                  style={{
                    display: 'flex',
                    marginTop: '12px',
                    flex: '0 0 350px'
                  }}>
                  {imageList.map((image, index) => (
                    <div key={index} className="image-item">
                      <div>
                        <Badge
                          color="secondary"
                          badgeContent={
                            <span onClick={() => onImageRemove(index)}>x</span>
                          }
                          style={{ cursor: 'pointer', marginRight: '12px' }}>
                          {
                            <img
                              src={image['data_url']}
                              alt=""
                              width="75"
                              height="75"
                            />
                          }
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ImageUploading>
        </div>
        {/* IMAGE UPLOADING */}

        <br/>
        <FormLabel required>What is your nickname?</FormLabel>
        <TextField
          onChange={handleNickname}
          id="nickname"
          label="Nickname"
          placeholder="Example: jackson11!"
          variant="outlined"
          style={{ marginTop: 8 }}
          inputProps={{
            maxLength: 60
          }}/>
        <div>For privacy reasons, do not use your full name or email address</div>
        <br/>
        <FormLabel required>Your email</FormLabel>
        <TextField
          onChange={handleEmail}
          id="email"
          label="E-mail"
          placeholder="Example: jackson11@email.com"
          variant="outlined"
          style={{ marginTop: 8 }}
          inputProps={{
            maxLength: 60
          }}/>
        <div>For authentication reasons, you will not be emailed</div>
        <br/>
        <ButtonGroup>
          <Button onClick={handleClose}>Cancel</Button>
          {!submitSucceeded ?
            <Button onClick={onSubmitClick}>Submit</Button> :
            <Button color="secondary">Review Submitted!</Button>}
        </ButtonGroup>
      </FormControl>
    </div>
  );

  return (
    <>
      <Button
        variant="outlined"
        size="medium"
        endIcon={<AddIcon />}
        onClick={() => setOpen(true)}
      >
        Add Review
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </>
  );
}

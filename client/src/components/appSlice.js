import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
const axios = require('axios');

export const fetchProductInfo = createAsyncThunk(
  'products/getProductInfo',
  async (productId, thunkAPI) => {
    const response = await axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-bld/products/${productId}`);
    return response.data;
  }
);

export const fetchReviewMetadata = createAsyncThunk(
  'reviews/getReviewMetadata',
  async (productId, thunkAPI) => {
    const response = await axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-bld/reviews/meta?product_id=${productId}`);
    return response.data;
  }
);

export const fetchReviewsNewest = createAsyncThunk(
  'reviews/getReviewsNewest',
  async (productId, thunkAPI) => {
    const response = await axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-bld/reviews/?product_id=${productId}&count=100&sort=newest`);
    return response.data.results;
  }
);

export const fetchReviewsHelpful = createAsyncThunk(
  'reviews/getReviewsHelpful',
  async (productId, thunkAPI) => {
    const response = await axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-bld/reviews/?product_id=${productId}&count=100&sort=helpful`);
    return response.data.results;
  }
);

export const fetchReviewsRelevant = createAsyncThunk(
  'reviews/getReviewsRelevant',
  async (productId, thunkAPI) => {
    const response = await axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-bld/reviews/?product_id=${productId}&count=100&sort=relevant`);
    return response.data.results;
  }
);

const calcAvgRating = (objectOfRatings) => {
  let numOfReviews = Object.values(objectOfRatings).reduce(function (accumulator, currentValue) {
    return accumulator + parseInt(currentValue, 10);
  }, 0);

  let total = 0;
  for (let key in objectOfRatings) {
    total += parseInt(key, 10) * parseInt(objectOfRatings[key], 10);
  }

  let avg = total / numOfReviews;
  return avg;
};

const getNumOfReviews = (objectOfRatings) => {
  let total = 0;
  for (let key in objectOfRatings) {
    total += parseInt(objectOfRatings[key], 10);
  }
  return total;
};

const postTrackingData = (data) => {
  axios.post('https://app-hrsei-api.herokuapp.com/api/fec2/hr-bld/interactions', data);
  // .then(response => {
  //   console.log(response.data);
  // })
  // .catch(error => {
  //   console.log('Err posting tracking info');
  // });
};

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    //Initial state here
    productId: 18078,
    productInfo: {},
    reviews: [],
    reviewMetadata: {},
    rating: 0,
    numOfRatings: 0,

    // Tracking
    overviewClicks: 0,
    addToCartClicks: 0,
    addToOutfitClicks: 0,

    relatedProductsClicks: 0,
    compareClicks: 0,
    productCardClicks: 0,

    questionsAnswersClicks: 0,
    moreAnsweredQuestionsClicks: 0,
    showMoreAnswersClicks: 0,

    ratingsReviewsClicks: 0,
    sortBy5StarsClicks: 0,
    sortBy1StarClicks: 0,

    trackingData: []
  },
  //A reducer is a function that receives the current state and an action object, decides how to update the state if necessary, and returns the new state
  reducers: {
    changeProductId: (state, action) => {
      state.productId = action.payload;
    },

    // OVERVIEW TRACKING
    countOverviewClick: (state, action) => {
      state.overviewClicks++;
    },
    countAddToCartClick: (state, action) => {
      state.overviewClicks++;
      state.addToCartClicks++;
      state.trackingData.push({
        productId: state.productId,
        addToCartClicks: state.addToCartClicks,
        widget: 'Overview',
        overviewClicks: state.overviewClicks,
        timestamp: new Date().toString()
      });
      postTrackingData({
        element: 'AddToCart',
        widget: 'Overview',
        time: new Date().toString()
      });
      // console.log({
      //   productId: state.productId,
      //   addToCartClicks: state.addToCartClicks,
      //   widget: 'Overview',
      //   overviewClicks: state.overviewClicks,
      //   timestamp: new Date().toString()
      // });
    },
    countAddToOutfitClick: (state, action) => {
      state.overviewClicks++;
      state.addToOutfitClicks++;
      state.trackingData.push({
        productId: state.productId,
        addToOutfitClicks: state.addToOutfitClicks,
        widget: 'Overview',
        overviewClicks: state.overviewClicks,
        timestamp: new Date().toString()
      });
      postTrackingData({
        element: 'AddToOutfit',
        widget: 'Overview',
        time: new Date().toString()
      });
      // console.log({
      //   productId: state.productId,
      //   addToOutfitClicks: state.addToOutfitClicks,
      //   widget: 'Overview',
      //   overviewClicks: state.overviewClicks,
      //   timestamp: new Date().toString()
      // });
    },

    // RELATED PRODUCTS TRACKING
    countRelatedProductsClick: (state, action) => {
      state.relatedProductsClicks++;
    },
    countCompareClick: (state, action) => {
      state.relatedProductsClicks++;
      state.compareClicks++;
      state.trackingData.push({
        productId: state.productId,
        compareClicks: state.compareClicks,
        widget: 'Related Products',
        relatedProductsClicks: state.relatedProductsClicks,
        timestamp: new Date().toString()
      });
      postTrackingData({
        element: 'CompareProducts',
        widget: 'Related Products',
        time: new Date().toString()
      });
      // console.log({
      //   productId: state.productId,
      //   compareClicks: state.compareClicks,
      //   widget: 'Related Products',
      //   relatedProductsClicks: state.relatedProductsClicks,
      //   timestamp: new Date().toString()
      // });
    },
    countProductCardClick: (state, action) => {
      state.relatedProductsClicks++;
      state.productCardClicks++;
      state.trackingData.push({
        productId: state.productId,
        productCardClicks: state.productCardClicks,
        widget: 'Related Products',
        relatedProductsClicks: state.relatedProductsClicks,
        timestamp: new Date().toString()
      });
      postTrackingData({
        element: 'ProductCard',
        widget: 'Related Products',
        time: new Date().toString()
      });
      // console.log({
      //   productId: state.productId,
      //   productCardClicks: state.productCardClicks,
      //   widget: 'Related Products',
      //   relatedProductsClicks: state.relatedProductsClicks,
      //   timestamp: new Date().toString()
      // });
    },

    // QUESTIONS & ANSWERS TRACKING
    countQuestionsAnswersClick: (state, action) => {
      state.questionsAnswersClicks++;
    },
    countMoreAnsweredQuestionsClick: (state, action) => {
      state.questionsAnswersClicks++;
      state.moreAnsweredQuestionsClicks++;
      state.trackingData.push({
        productId: state.productId,
        moreAnsweredQuestionsClicks: state.moreAnsweredQuestionsClicks,
        widget: 'Questions & Answers',
        questionsAnswersClicks: state.questionsAnswersClicks,
        timestamp: new Date().toString()
      });
      postTrackingData({
        element: 'MoreAnswererdQuestions',
        widget: 'Questions & Answers',
        time: new Date().toString()
      });
      // console.log({
      //   productId: state.productId,
      //   moreAnsweredQuestionsClicks: state.moreAnsweredQuestionsClicks,
      //   widget: 'Questions & Answers',
      //   questionsAnswersClicks: state.questionsAnswersClicks,
      //   timestamp: new Date().toString()
      // });
    },
    countShowMoreAnswersClick: (state, action) => {
      state.questionsAnswersClicks++;
      state.showMoreAnswersClicks++;
      state.trackingData.push({
        productId: state.productId,
        showMoreAnswersClicks: state.showMoreAnswersClicks,
        widget: 'Questions & Answers',
        questionsAnswersClicks: state.questionsAnswersClicks,
        timestamp: new Date().toString()
      });
      postTrackingData({
        element: 'MoreAnswers',
        widget: 'Questions & Answers',
        time: new Date().toString()
      });
      // console.log({
      //   productId: state.productId,
      //   moreAnsweredQuestionsClicks: state.moreAnsweredQuestionsClicks,
      //   widget: 'Questions & Answers',
      //   questionsAnswersClicks: state.questionsAnswersClicks,
      //   timestamp: new Date().toString()
      // });
    },

    // RATINGS & REVIEWS TRACKING
    countRatingsReviewsClick: (state, action) => {
      state.ratingsReviewsClicks++;
    },
    countSortBy5StarsClick: (state, action) => {
      state.ratingsReviewsClicks++;
      state.sortBy5StarsClicks++;
      state.trackingData.push({
        productId: state.productId,
        sortBy5StarsClicks: state.sortBy5StarsClicks,
        widget: 'Ratings & Reviews',
        ratingsReviewsClicks: state.ratingsReviewsClicks,
        timestamp: new Date().toString()
      });
      postTrackingData({
        element: 'SortBy5Stars',
        widget: 'Ratings & Reviews',
        time: new Date().toString()
      });
      // console.log({
      //   productId: state.productId,
      //   sortBy5StarsClicks: state.sortBy5StarsClicks,
      //   widget: 'Ratings & Reviews',
      //   ratingsReviewsClicks: state.ratingsReviewsClicks,
      //   timestamp: new Date().toString()
      // });
    },
    countSortBy1StarClick: (state, action) => {
      state.ratingsReviewsClicks++;
      state.sortBy1StarClicks++;
      state.trackingData.push({
        productId: state.productId,
        sortBy1StarClicks: state.sortBy1StarClicks,
        widget: 'Ratings & Reviews',
        ratingsReviewsClicks: state.ratingsReviewsClicks,
        timestamp: new Date().toString()
      });
      postTrackingData({
        element: 'SortBy1Star',
        widget: 'Ratings & Reviews',
        time: new Date().toString()
      });
      // console.log({
      //   productId: state.productId,
      //   sortBy1StarClicks: state.sortBy1StarClicks,
      //   widget: 'Ratings & Reviews',
      //   ratingsReviewsClicks: state.ratingsReviewsClicks,
      //   timestamp: new Date().toString()
      // });
    }
  },
  //Reducers that depend upon async actions are defined here
  extraReducers: {
    [fetchProductInfo.fulfilled]: (state, action) => {
      state.productInfo = action.payload;
    },
    [fetchReviewMetadata.fulfilled]: (state, action) => {
      state.reviewMetadata = action.payload;
      if (state.reviewMetadata.ratings) {
        state.rating = calcAvgRating(state.reviewMetadata.ratings);
        state.numOfRatings = getNumOfReviews(state.reviewMetadata.ratings);
      }
    },
    [fetchReviewsNewest.fulfilled]: (state, action) => {
      state.reviews = action.payload;
    },
    [fetchReviewsRelevant.fulfilled]: (state, action) => {
      state.reviews = action.payload;
    },
    [fetchReviewsHelpful.fulfilled]: (state, action) => {
      state.reviews = action.payload;
    }
  }
});

//Action creators are generated for each reducer function. Add multiple like so { reducer1, reducer2, ...}
export const {
  changeProductId,

  countOverviewClick,
  countAddToCartClick,
  countAddToOutfitClick,

  countRelatedProductsClick,
  countCompareClick,
  countProductCardClick,

  countQuestionsAnswersClick,
  countMoreAnsweredQuestionsClick,
  countShowMoreAnswersClick,

  countRatingsReviewsClick,
  countSortBy5StarsClick,
  countSortBy1StarClick

} = appSlice.actions;

//Makes the reducers defined above available to the store
export default appSlice.reducer;

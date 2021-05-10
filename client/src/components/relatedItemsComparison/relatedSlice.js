import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
const axios = require('axios');

const generateRelatedItemsPromise = function (productId) {
  return axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-bld/products/${productId}`);
};

const generateRelatedStylePromise = function (productId) {
  return axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-bld/products/${productId}/styles`);
};

const generateRelatedReviewMetaDataPromise = function (productId) {
  return axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-bld/reviews/meta?product_id=${productId}`);
};

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

export const fetchRelated = createAsyncThunk(
  'products/getRelated',
  async (productId, thunkAPI) => {
    let itemInfo;
    await axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-bld/products/${productId}/related`)
      .then(function (response) {
        return response.data;
      })
      .then((arrayOfRelatedIds) => {
        let promiseArray = [];
        arrayOfRelatedIds.map((itemId, index) => {
          promiseArray[index] = (generateRelatedItemsPromise(itemId));
        });
        return promiseArray;
      })
      .then((promiseArray) => {
        return (Promise.all(promiseArray));
      })
      .then((resolvedPromises) => {
        itemInfo = [];
        resolvedPromises.map((item, index) => {
          itemInfo[index] = item.data;
        });
        return itemInfo;
      })
      .then((itemInfoArray) => {
        let promiseArray = [];
        itemInfoArray.map((item, index) => {
          promiseArray[index] = (generateRelatedStylePromise(item.id));
        });
        return promiseArray;
      })
      .then((promiseArray) => {
        return (Promise.all(promiseArray));
      })
      .then((resolvedStylePromises) => {
        resolvedStylePromises.map((item, index) => {
          if (item.data.results[0].photos[0].thumbnail_url) {
            itemInfo[index].photo = item.data.results[0].photos[0].url;
          } else {
            itemInfo[index].photo = "/assets/imgPlaceholder.jpeg";
          }
        });
        return (itemInfo);
      })
      .then((itemInfoArray) => {
        let promiseArray = [];
        itemInfoArray.map((item, index) => {
          promiseArray[index] = (generateRelatedReviewMetaDataPromise(item.id));
        });
        return promiseArray;
      })
      .then((promiseArray) => {
        return (Promise.all(promiseArray));
      })
      .then((resolvedRatingPromises) => {
        resolvedRatingPromises.map((item, index) => {
          itemInfo[index].ratings = calcAvgRating(item.data.ratings);
        });
        return (itemInfo);
      })
      .catch(function (error) {
        // console.error(error);
      });
    return itemInfo;
  }
);

export const relatedSlice = createSlice({
  name: 'related',
  initialState: {
    currentItem: null,
    related: []
  },
  reducers: {
    selectRelated: (state, action) => {
      state.currentItem = action.payload;
    }
  },
  extraReducers: {
    [fetchRelated.fulfilled]: (state, action) => {
      state.related = action.payload;
    }
  }
});

export const { selectRelated } = relatedSlice.actions;

export default relatedSlice.reducer;


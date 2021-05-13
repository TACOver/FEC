import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
const axios = require('axios');

export const markHelpful = createAsyncThunk(
  'reviews/markHelpful',
  async (reviewId, thunkAPI) => {
    await axios.put(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-bld/reviews/${reviewId}/helpful`);
    return reviewId;
  }
);

export const reportReview = createAsyncThunk(
  'reviews/report',
  async (reviewId, thunkAPI) => {
    await axios.put(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-bld/reviews/${reviewId}/report`);
    return reviewId;
  }
);

export const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviewsCount: 2,
    markedHelpful: [],
    markedNotHelpful: [],
    reported: [],
    sortBy: { value: 'relevant', label: 'relevant' },
    filter: []
  },
  reducers: {
    loadReviews: (state, action) => {
      state.reviewsCount += 2;
    },
    markNonHelpful: (state, action) => {
      state.markedNotHelpful.push(action.payload);
    },
    setSort: (state, action) => {
      state.sortBy = action.payload;
    },
    seeAllReviews: (state, action) => {
      state.reviewsCount = action.payload;
    },
    adjustFilter: (state, action) => {
      if (state.filter.includes(action.payload)) {
        state.filter.splice(state.filter.indexOf(action.payload), 1);
      } else {
        state.filter.push(action.payload);
      }
    },
    clearFilter: (state, action) => {
      state.filter = [];
    }
  },
  extraReducers: {
    [markHelpful.fulfilled]: (state, action) => {
      state.markedHelpful.push(action.payload);
    },
    [reportReview.fulfilled]: (state, action) => {
      state.reported.push(action.payload);
    }
  }
});

//Action creators are generated for each reducer function. Add multiple like so { reducer1, reducer2, ...}
export const { loadReviews, markNonHelpful, setSort, seeAllReviews, adjustFilter, clearFilter } = reviewSlice.actions;

//Makes the reducers defined above available to the store
export default reviewSlice.reducer;

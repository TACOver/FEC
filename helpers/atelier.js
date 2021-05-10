const axios = require('axios');
const API_KEY = require('../APIconfig');
const API_URL = 'http://app-hrsei-api.herokuapp.com/api/fec2/hr-bld';

const getEndpoint = (endpoint, callback) => {
  axios.get(`${API_URL}/${endpoint}`, {
    headers: {
      Authorization: API_KEY
    }
  })
    .then(response => {
      callback(null, response.data);
    })
    .catch(error => {
      console.log('Err getting all products from Atelier', error);
    });
};

const postToEndpoint = (endpoint, body, callback) => {
  axios.post(`${API_URL}/${endpoint}`, body, {
    headers: {
      Authorization: API_KEY
    }
  })
    .then(response => {
      callback(null, response);
    })
    .catch(error => {
      console.log('Error posting to Atelier', error.message);
    });
};

const putToEndpoint = (endpoint, body, callback) => {
  axios.put(`${API_URL}/${endpoint}`, body, {
    headers: {
      Authorization: API_KEY
    }
  })
    .then(response => {
      callback(null, response);
    })
    .catch(error => {
      console.log('Error updating Atelier', error);
    });
};

module.exports = {
  getEndpoint: getEndpoint,
  postToEndpoint: postToEndpoint,
  putToEndpoint: putToEndpoint
};

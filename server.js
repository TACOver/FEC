const express = require('express');
const atelier = require('./helpers/atelier');
const path = require('path');

const app = express();
const port = 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, './client/dist')));

<<<<<<< HEAD
// QUESTION REQUESTS
app.get('/qa/questions', (req, res) => {
  if (err) {
    console.log('FEC ERROR ', err);
  } else {
    console.log('FEC GET successful', res);
  }
});

app.post('/qa/*', (req, res) => {
  if (err) {
    console.log('FEC ERROR ', err);
  } else {
    console.log('FEC POST successful', res);
  }
});

app.put('/qa/*', (req, res) => {
  if (err) {
    console.log('FEC ERROR ', err);
  } else {
    console.log('FEC PUT successful', res);
  }
});

// ORIGINAL REQUESTS
app.get('/api/*', (req, res) => {
=======
app.get('/', (req, res) => {
>>>>>>> main
  let endpoint = req.url.substring(15);
  atelier.getEndpoint(endpoint, (error, products) => {
    if (error) {
      console.log('Server Error while retrieving all products:', error);
    } else {
      res.send(products);
    }
  });
});

app.post('/', (req, res) => {
  let endpoint = req.query.endpoint;
  // console.log('endpoint:', endpoint);
  atelier.postToEndpoint(endpoint, req.body, (error, results) => {
    if (error) {
      console.log('Server Error while posting: ');
    } else {
      res.send('Successfully added! Status Code: ' + results.status);
    }
  });
});

<<<<<<< HEAD
app.put('/api/*', (req, res) => {
=======
// app.post('/reviewPhotos', (req, res) => {
// });

app.put('/', (req, res) => {
>>>>>>> main
  let endpoint = req.query.endpoint;
  atelier.putToEndpoint(endpoint, req.body, (error, results) => {
    if (error) {
      console.log('Server Error while putting: ', error);
    } else {
      res.send('Successfully updated! Status Code: ' + results.status);
    }
  });
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

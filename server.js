const express = require('express');
const atelier = require('./helpers/atelier');
const path = require('path');

const app = express();
const port = 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, './client/dist')));

app.get('/', (req, res) => {
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

// app.post('/reviewPhotos', (req, res) => {
// });

app.put('/', (req, res) => {
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

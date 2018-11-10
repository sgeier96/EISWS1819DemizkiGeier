var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var serverURL = 'http://localhost:8080/';
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();

var reviewRoute = require('./routes/reviewRoute');
app.use('/review', reviewRoute);

var literatureRoute = require('./routes/literatureRoute');
app.use('/literature', literatureRoute);






app.listen(3000, function(){
  console.log("Der Dienstnutzer ist nun auf Port 3000 verfügbar.");
});

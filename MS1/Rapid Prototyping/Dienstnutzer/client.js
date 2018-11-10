var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');

var serverURL = 'http://localhost:8080/';
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();

app.post('/literature', function(req, res){
    let urlLiterature = serverURL + 'literature';
    let productData = {
      "title" : req.body.autor,
      "autor" : req.body.autor,
      "genre" : req.body.genre,
      "content" : req.body.content,
      "review" : req.body.review
    };
    let options = {
      uri: urlLiterature,
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      json : productData
    };

    request.post(options, function(err, response, body){
      if(err){
        res.status(404).send('Fehler: POST Request');
      }
      else {
        res.status(201).send(body);
      }
    });
});

app.get('/literature', function(req,res){
  let urlLiterature = serverURL + 'literature';

  request.get(urlLiterature, function(err, response, body){
    if(err){
      res.status(404).send('Fehler: GET Request');
    }
    else {
      res.status(200).send(JSON.parse(body));
    }
  });
});

app.put('/literature/:literature_id', function(req,res){
    let urlLiterature = serverURL + 'literature/'+req.params.literature_id;
    let productData = {
      "title" : req.body.title,
      "autor" : req.body.autor,
      "genre" : req.body.genre,
      "content" : req.body.content,
      "review" : req.body.review
    };
    let options = {
      uri: urlLiterature,
      method: 'PUT',
      headers:{
        'Content-Type': 'application/json'
      },
      json : productData
    };

    request.put(options, function(err, response, body){
      if(err){
        res.status(404).send('Fehler: PUT Request');
      }
      else {
        res.status(201).send(body);
      }
    });
});

app.listen(3000, function(){
  console.log("Der Dienstnutzer ist nun auf Port 3000 verfügbar.");
});

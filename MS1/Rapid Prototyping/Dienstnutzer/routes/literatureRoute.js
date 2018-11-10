module.exports = (function() {
    'use strict';
    var literatureRoute = require('express').Router();
    var serverURL = 'http://localhost:8080/';
    var request = require('request');
    
    literatureRoute.route('/')

      .post(function(req, res){
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
      })

      .get(function(req,res){
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

    return literatureRoute;
})();

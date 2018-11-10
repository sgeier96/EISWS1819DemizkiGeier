module.exports = (function() {
    'use strict';
    var reviewRoute = require('express').Router();
    var serverURL = 'http://localhost:8080/';
    var request = require('request');
    
    reviewRoute.route('/:literature_id')

      .put( function(req,res){
        let urlLiterature = serverURL + 'literature/'+req.params.literature_id;
        let productData = {
          "title" : req.body.autor,
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

    return reviewRoute;
})();

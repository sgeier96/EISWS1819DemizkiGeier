module.exports = (function() {
    'use strict';
    var reviewRoute = require('express').Router();
    var serverURL = 'http://localhost:8080/';
    var request = require('request');
    
    reviewRoute.route('/:literature_id')

      .put( function(req,res){
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
      analyzeForSentiment();
      });

      function analyzeForSentiment(documents){

        'use strict';
        
        let path = '/text/analytics/v2.0/sentiment';
        
        let response_handler = function (response) {
            let body = '';
            response.on ('data', function (d) {
                body += d;
            });
            response.on ('end', function () {
                let body_ = JSON.parse (body);
                let body__ = JSON.stringify (body_, null, '  ');
                console.log (body__);
            });
            response.on ('error', function (e) {
                console.log ('Error: ' + e.message);
            });
        };
        
        let get_sentiments = function (documents) {
            let body = JSON.stringify (documents);
        
            let request_params = {
                method : 'POST',
                hostname : azureUri,
                path : path,
                headers : {
                    'Ocp-Apim-Subscription-Key' : azureAccessKey,
                }
            };
        
            let req = https.request (request_params, response_handler);
            req.write (body);
            req.end ();
        }
        
        
        
        get_sentiments (documents);
        }

    return reviewRoute;
})();

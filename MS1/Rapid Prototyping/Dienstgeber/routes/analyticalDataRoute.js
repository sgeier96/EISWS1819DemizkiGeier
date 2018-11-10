module.exports = (function() {
    'use strict';
    var analyticalDataRoute = require('express').Router();
    var AnalyticalData = require('../app/models/analyticalData');

    analyticalDataRoute.route('/')

      .post(function(req, res){
        var analyticalData = new AnalyticalData();
        analyticalData.genre = req.body.genre;
        analyticalData.sentiment = req.body.sentiment;
        analyticalData.keyPhrases = req.body.keyPhrases;

        analyticalData.save(function(err) {
            if (err){
              res.status(500).send(err);
            }
            res.status(201).send('AnalyticalData erstellt.');
        });
      })
      .get(function(req,res){
        AnalyticalData.find(function(err, analyticalData) {
            if (err){
              res.status(500).send(err);
            }
            else {
              res.status(200).send(analyticalData);
            }
        });
      });

    return analyticalDataRoute;
})();

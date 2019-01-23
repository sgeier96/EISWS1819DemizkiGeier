module.exports = (function () {
  'use strict';
  var analyticalDataRoute = require('express').Router();
  var AnalyticalData = require('../app/models/analyticalData');
  var Literature = require('../app/models/literature');


  analyticalDataRoute.route('/')

    .post(function (req, res) {
      let analyticalData = new AnalyticalData();
      Literature.findById(req.body.literatureId, function (err, foundLiterature) {
        if (err) {
          res.status(500).send(err);
        } else {
          analyticalData.revContent = req.body.revContent;
          (req.body.genre) ? analyticalData.genre = req.body.genre : analyticalData.genre = foundLiterature.genre;
          analyticalData.overallSentiment = req.body.overallSentiment;
          analyticalData.keyPhrases = req.body.keyPhrases;
          analyticalData.sourceType = req.body.sourceType;
          analyticalData.literatureHref = req.get('host') + '/literatures/' + req.body.literatureId;

          analyticalData.save(function (err, analyticalData) {
            if (err) {
              res.status(500).send(err);
            } else {
              res.status(201).send(analyticalData);
            }
          }); // END OF save()
        } // END OF else
      }).catch(console.error); // END OF findById()
    })
    .get(function (req, res) {
      AnalyticalData.find(function (err, analyticalData) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).send(analyticalData);
        }
      });
    });

  analyticalDataRoute.route('/:analyticalData_id')

      .get(function(req, res) {
          AnalyticalData.findById(req.params.analyticalData_id, function(err, analyticalData) {
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

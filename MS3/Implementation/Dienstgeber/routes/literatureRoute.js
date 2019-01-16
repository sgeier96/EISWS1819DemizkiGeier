module.exports = (function() {
    'use strict';
    var literatureRoute = require('express').Router();
    var Literature = require('../app/models/literature');

    literatureRoute.route('/')

      .post(function(req, res){
        let literature = new Literature();
        literature.title = req.body.title;
        literature.author = req.body.author;
        literature.genre = req.body.genre;
        literature.releaseDate = req.body.releaseDate;
        literature.content = req.body.content;
        literature.callCount = req.body.callCount;
        literature.reviews = req.body.reviews;
        literature.like = req.body.like;
        literature.dislike = req.body.dislike;
        if (req.body.advices) literature.advices = req.body.advices;
        if (req.body.status) literature.status = req.body.status;

        literature.save(function(err, literature) {
            if (err){
              res.status(500).send(err);
            } else {
              res.status(201).send(literature);
            }
        });
      })
      .get(function(req,res){
        Literature.find(function(err, literature) {
            if (err){
              res.status(500).send(err);
            }
            else {
              res.status(200).send(literature);
            }
        });
      });

    literatureRoute.route('/:literature_id')
      .put(function(req,res){
      
          Literature.findById(req.params.literature_id, function(err, foundLiterature){
            if (err) {
              res.status(500).send(err);
            } else {
              if(foundLiterature){
                if(req.body.title) foundLiterature.title = req.body.title;
                if(req.body.author) foundLiterature.author = req.body.author;
                if(req.body.genre) foundLiterature.genre = req.body.genre;
                if(req.body.releaseDate) foundLiterature.releaseDate = req.body.releaseDate;
                if(req.body.content) foundLiterature.content = req.body.content;                
                if(foundLiterature.reviews == undefined && req.body.reviews != undefined) foundLiterature.reviews = req.body.reviews;
                  else if(foundLiterature.reviews != undefined && req.body.reviews != undefined) foundLiterature.reviews.push(req.body.reviews);
                if(foundLiterature.advices == undefined && req.body.advices != undefined) foundLiterature.advices = req.body.advices;
                  else if(foundLiterature.advices != undefined && req.body.advices != undefined) foundLiterature.advices.push(req.body.advices);
                (req.body.like != undefined) ? foundLiterature.like++ : foundLiterature.like = 1;
                (req.body.dislike != undefined) ? foundLiterature.dislike++ : foundLiterature.dislike = 1;
                (req.body.status != undefined) ? foundLiterature.satus = req.body.status : foundLiterature.status = 'WIP';
                
                foundLiterature.save(function(err, savedLiterature){
                  if (err) {
                    res.status(500).send(err);
                  } else {
                    res.status(200).send(savedLiterature);
                  }
                }); // END OF foundLiterature.save()
              } // END OF if(foundLiterature)
            } // END OF else
          }); // END OF Literature.findById()
      }) // END OF .put()
      
      .get(function(req, res) {
            Literature.findById(req.params.literature_id, function(err, literature) {
                if (err){
                  res.status(500).send(err);
                }
                literature.callCount = literature.callCount + 1;                // Aufrufe zählen

                literature.save(function(err) {
                  if (err){
                    res.status(500).send(err);
                  }
                  else {
                    res.status(200).send(literature);
                  }
                });
            });
      })

      .delete(function(req, res) {

            Literature.deleteOne({
                _id: req.params.literature_id
            }, function(err, literature) {
                if (err){
                  res.status(500).send(err);
                }
                else {
                  res.status(200).send('Erfolgreich gelöscht');
                }
            });
      });

    return literatureRoute;
})();

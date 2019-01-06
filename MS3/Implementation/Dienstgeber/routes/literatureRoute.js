module.exports = (function() {
    'use strict';
    var literatureRoute = require('express').Router();
    var Literature = require('../app/models/literature');

    literatureRoute.route('/')

      .post(function(req, res){
        var literature = new Literature();
        literature.title = req.body.title;
        literature.autor = req.body.autor;
        literature.genre = req.body.genre;
        literature.releaseDate = req.body.releaseDate;
        literature.content = req.body.content;
        literature.callCount = req.body.callCount;
        literature.review = req.body.review;
        literature.like = req.body.like;
        literature.dislike = req.body.dislike;

        literature.save(function(err) {
            if (err){
              res.status(500).send(err);
            }
            res.status(201).send('Literature erstellt.');
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
          Literature.findByIdAndUpdate(req.params.literature_id,
                      {$push:{review: req.body.review}},
                      {safe: true, upsert: true, new: true},
                      function(err, literature) {
                        if (err){
                          res.status(500).send(err);
                        }
                        else {
                          if(literature != null){
                            literature.title = req.body.title;
                            literature.autor = req.body.autor;
                            literature.genre = req.body.genre;
                            literature.releaseDate = req.body.releaseDate;
                            literature.content = req.body.content;
                            literature.like = req.body.like;                    //To-Do: Wie verfahren, wenn geliked wird?
                            literature.dislike = req.body.dislike;
                            literature.review = req.body.review;

                            literature.save(function(err) {
                              if (err){
                                res.status(500).send(err);
                              }
                              else {
                                res.status(200).send(literature);
                              }
                            });
                          }
                          else {
                            res.status(500).send(err);
                          }
                        }
          });
      })

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

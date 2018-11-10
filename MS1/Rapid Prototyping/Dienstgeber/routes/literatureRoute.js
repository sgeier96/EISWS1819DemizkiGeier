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
        literature.content = req.body.content;
        literature.review = req.body.review;

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

      .put( function(req,res){
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
                            literature.content = req.body.content;
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
      });
    return literatureRoute;
})();

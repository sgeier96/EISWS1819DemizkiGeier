module.exports = (function() {
    'use strict';
    var orderRoute = require('express').Router();
    var Order = require('../app/models/order');

// Diese hier angewandten Funktionen, die sich mit dem Umgang von Routen und der Datenbank (mongoDB)
// beschäftigen, wurden aus dem Modul WBA2 und dem Projekt WBA2SS18DemizkiMueldersGeier entnommen und auf das aktuelle
// Szenario angepasst.

    orderRoute.route('/')

      .post(function(req, res){
        var order = new Order();
        order.user = req.body.user;
        order.items = req.body.items;
        //order.wholePrice = req.body.wholePrice;

        order.save(function(err) {
            if (err){
              res.status(500).send(err);
            }
            res.status(201).send('Erfolgreich erstellt');
        });
      })

    orderRoute.route('/:order_id')

      .get(function(req, res) {
            Order.findById(req.params.order_id, function(err, order) {
                if (err){
                  res.status(500).send(err);
                }
                res.status(200).send(order);
            });
      })

      .delete(function(err, order) {
        Order.deleteOne({
                _id: req.params.order_id
            }, function(err, order) {
                if (err){
                  res.status(500).send(err);
                }
                else {
                  res.status(200).send('Erfolgreich gelöscht');
                }
              });
      });

    return orderRoute;
})();

module.exports = (function() {
    'use strict';
    var cartRoute = require('express').Router();
    var Cart = require('../app/models/cart');

// Diese hier angewandten Funktionen, die sich mit dem Umgang von Routen und
// der Datenbank (mongoDB) beschäftigen, wurden aus dem Modul WBA2 und dem
// Projekt WBA2SS18DemizkiMueldersGeier entnommen und auf das aktuelle Szenario
// angepasst.

    cartRoute.route('/')

      .post(function(req, res) {

          var cart = new Cart();
          cart.user = req.body.user;
          cart.items = req.body.items;

          Cart.findOne({user: cart.user},function(err, result) {
            if (err){
               res.status(500).send(err);
            }

            if (result) {
              res.status(200).send(result);
            } else {
              cart.save(function(err) {                                         // Erstellen eines Warenkorbes.
                  if (err){                                                     // Verwendungszeitpunkt : Benutzeranmeldung
                    res.status(500).send(err);
                  }
                  else {
                    res.status(201).send('Warenkorb erstellt!');
                  }
              });
            }
          });
      });

    cartRoute.route('/:cart_id')

      .get(function(req, res) {
          Cart.findById(req.params.cart_id, function(err, cart) {
              if (err){
                res.status(500).send(err);
              }
              else {
                res.status(200).send(cart);
              }
          });
      })

      .put(function(req, res) {
          Cart.findOneAndUpdate(req.params.cart_id,
            {update:{items: req.body.items}},
            {safe: true, upsert: true, new: true},
            function(err, cart) {
              if (err){
                res.status(500).send(err);
              }
              else {
                    cart.items = req.body.items;

                    cart.save(function(err) {
                      if (err){
                        res.status(500).send(err);
                      }
                      else {
                        res.status(200).send(cart);
                      }
                    });
                  }
            });
      });
    return cartRoute;
})();

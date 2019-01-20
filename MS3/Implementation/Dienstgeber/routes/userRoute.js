module.exports = (function () {
    'use strict';
    var userRoute = require('express').Router();
    var User = require('../app/models/user');

    userRoute.route('/')

        .post(function (req, res) {
            var user = new User();
            //TODO implementing an unique userID (mongoDB-sided?)
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.email = req.body.email;

            if (req.body.birthday != null) {
                user.birthday = req.body.birthday;
            }

            if (req.body.attendedCourses != null) {
                user.attendedCourses = req.body.attendedCourses;
            }
            if (req.body.favouriteGenres != null) {
                user.favouriteGenres = req.body.favouriteGenres;
            }

            user.save(function (err) {
                if (err) {
                    res.status(500).send(err);
                }
                res.status(201).send('User ' + user.email + ' created.');
            });
        })
        .get(function (req, res) {
            User.find(function (err, user) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(200).json(user);
                }
            });
        });

    userRoute.route('/:userId')

        .put(function(req, res){
            User.findByIdAndUpdate(req.params.userId,
                req.body,
                {new: true},
                function(err, updatedUser){
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        console.log(updatedUser.email);
                        res.status(200).send(updatedUser);
                    }
                }
            );
        })

        .delete(function (req, res) {
            User.findByIdAndDelete(req.params.userId,
                function(err, deletedUser){
                    if(err){
                        res.status(500).send(err);
                    } else if(deletedUser == null){
                        res.status(500).send('User ' + req.body.email + ' couldnt be found in order to delete it.')
                    } else {
                        res.status(200).send('User ' + deletedUser.email + ' deleted.');
                    }
                }
            );
        });


    return userRoute;
})();

var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

app.use(function(req, res, next) {
    console.log('A request has come in!');
    next();
});

app.get('/', function(req, res) {
    res.status(200).send('Standard-Route worked!');
});

var Rezension = require('../app/models/rezension');

app.post('/rezension', function(req, res){
  var rezension = new Rezension();
  rezension.inhalt = req.body.inhalt;
  rezension.buchID = req.body.buchID;
  rezension.verlegerID = req.body.verlegerID;

  rezension.save(function(err) {
      if (err){
        res.status(500).send(err);
      }
      res.status(201).send('Rezension erstellt.');
  });
});

app.get('/rezension', function(req,res){
    Rezension.find(function(err, rezension) {
        if (err){
          res.status(500).send(err);
        }
        else {
          res.status(200).send(rezension);
        }
    });
  });

//========================== MONGODB CONNECTION ================================
var mongoose   = require('mongoose');                                           // Mit mongoDB verbinden
mongoose.connect('mongodb+srv://vadeki:m81HjAmsYNoJS8g9@wba2-peu7d.mongodb.net/EISWS1819?retryWrites=true', function(err, client) {
   if (err){
     res.status(500).send('Fehler bei der Verbindung zur Datenbank');
   }
});

// ========================= SERVER STARTEN ====================================
app.listen(port, function() {
    console.log("Server is running on port " + port);
});

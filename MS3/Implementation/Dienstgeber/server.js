var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var serverURL = 'http://localhost:8080/';
var request = require('request');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

var pastLiteratureData = [];                                                    // Abfrage nach Zugriffszeitraum
var trends = [];
var empty = false;

var port = process.env.PORT || 8080;
var router = express.Router();

app.use(function(req, res, next) {
    console.log('A request has come in!');
    next();
});

app.get('/', function(req, res) {
    res.status(200).send('Standard-Route worked!');
});

var userRoute = require('./routes/userRoute');
app.use('/user', userRoute);

var literatureRoute = require('./routes/literatureRoute');
app.use('/literatures', literatureRoute);

var analyticalDataRoute = require('./routes/analyticalDataRoute');
app.use('/analyticalData', analyticalDataRoute);

var orderRoute = require('./routes/orderRoute');
app.use('/orders', orderRoute);

var cartRoute = require('./routes/cartRoute');
app.use('/carts', cartRoute);

//============================ TRENDS FUNCTION =================================

app.get('/trends', function(req, res){                                          // Trends ausgeben.
  res.status(200).send(trends);
});

setInterval(function () {
  var Literature = require('./app/models/literature');
  empty = false;
  var i = 0;

  Literature.find(function(err, literature) {
      if (err){
        console.log(err);
      }

      while (true) {
        if(pastLiteratureData[i] && literature[i]){             // To-Do: Überprüfen ob 0 vorhanden ist
            var callIncrease = literature[i].callCount / pastLiteratureData[i].callCount;
            var likeIncrease = literature[i].like / pastLiteratureData[i].like;

            if(callIncrease >= 1.5 && pastLiteratureData[i].callCount >= 1000 || likeIncrease >= 1.5 && pastLiteratureData[i].like >= 20){
                trends[i] = literature[i];                                    // Erweiterung: Mögliche Grenze -> 1000 Aufrufe am Anfang
                                                                                  // To-To: Für unterschiedliche Grenzen andere Increase-Werte!
            }
            //console.log(trends);
            // if (commentCount >= 1.1)
            i++;
        }
        else {
          pastLiteratureData = literature;
          return false;
        }
      }
  });
}, 1000);

//========================== MONGODB CONNECTION ================================
var mongoose   = require('mongoose'); // Mit mongoDB verbinden
mongoose.connect('mongodb+srv://vadeki:m81HjAmsYNoJS8g9@wba2-peu7d.mongodb.net/EISWS1819?retryWrites=true', function(err, client) {
   if (err){
     res.status(500).send('Fehler bei der Verbindung zur Datenbank');
   }
});
// ========================= SERVER STARTEN ====================================
app.listen(port, function() {
    console.log("Server is running on port " + port);
});

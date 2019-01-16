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
<<<<<<< HEAD
        if(pastLiteratureData[i] != null && literature[i] != null){             // To-Do: Überprüfen ob 0 vorhanden ist

=======
        if(pastLiteratureData[i] && literature[i]){             // To-Do: Überprüfen ob 0 vorhanden ist
>>>>>>> feat/reviewingBooks
            var callIncrease = literature[i].callCount / pastLiteratureData[i].callCount;
            var trendsCallBorder = (0.00025 * -Math.sqrt(pastLiteratureData[i].callCount)+ 0.3) + 1;

            var likeIncrease = literature[i].like / pastLiteratureData[i].like;
            var trendsLikeBorder = (0.00025 * -Math.sqrt(pastLiteratureData[i].callCount)+ 0.3) + 1; // To-Do: Später anpassen!!

            //1.292094305849579 bei 1000
            if(trendsCallBorder <= callIncrease){
              trends[i] = literature[i];
              //console.log("Erfolgreich in den Trends - trendsCallBorder(Grenze): " + trendsCallBorder + " Steigerung " + callIncrease);
            }
            if(trendsLikeBorder <= likeIncrease){
              trends[i] = literature[i];
              //console.log("Erfolgreich in den Trends - trendsCallBorder(Grenze): " + trendsCallBorder + " Steigerung " + callIncrease);
            }
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

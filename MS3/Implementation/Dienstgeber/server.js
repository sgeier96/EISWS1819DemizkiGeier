var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var serverURL = 'http://localhost:8080/';
var request = require('request');

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

var literatureRoute = require('./routes/literatureRoute');
app.use('/literature', literatureRoute);

var analyticalDataRoute = require('./routes/analyticalDataRoute');
app.use('/analyticalData', analyticalDataRoute);

var orderRoute = require('./routes/orderRoute');
app.use('/order', orderRoute);

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

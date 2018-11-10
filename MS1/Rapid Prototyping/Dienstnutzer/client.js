var express = require('express');
var request = require('request');
var app = express();
var bodyParser = require('body-parser');

var serverURL = 'http://localhost:8080/';
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/rezension', function(req, res){

    let urlRezension = serverURL + 'rezension';

    request.get(urlRezension, function(err, response, body){                     
      if(err){
        res.status(404).send('Fehler: GET Request');
      }
      else {
        res.status(200).send(JSON.parse(body));
      }
    });
});

//==============================================================================
app.listen(3000, function(){                                                    // Der Dienstnutzer ist auf Port 3000 verfügbar.
  console.log("Der Dienstnutzer ist nun auf Port 3000 verfügbar.");
});

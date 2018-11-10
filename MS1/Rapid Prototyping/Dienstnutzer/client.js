var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');

var serverURL = 'http://localhost:8080/';
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();



//Buch erstellen
app.post('/literature', function(req, res){
    let urlLiterature = serverURL + 'literature';
    let literatureData = {
      "title" : req.body.title,
      "autor" : req.body.autor,
      "genre" : req.body.genre,
      "content" : req.body.content,
      "review" : req.body.review
    };
    let options = {
      uri: urlLiterature,
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      json : literatureData
    };

    request.post(options, function(err, response, body){
      if(err){
        res.status(404).send('Fehler: POST Request');
      }
      else {
        res.status(201).send(body);
      }
    });
});


//Microsoft Azure stuff
var https = require ('https');

var azureAccessKey = 'ee9078b90ddc40b6955e60a881888d8f';
var azureUri = 'westeurope.api.cognitive.microsoft.com';

//-------------------PLAYGROUND------------------------------------//

var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("Which function should be executed? \n ");
rl.question("Choose between: \n 1: Sentiment \n 2: Keywords \n 3: Write a book \n 4: Submit a review \n 5: Show all books \n", function(answer) {
  let documents = { 'documents': [
    { 'id': '1', 'language': 'en', 'text': 'I really enjoy the new XBox One S. It has a clean look, it has 4K/HDR resolution and it is affordable.' },
    { 'id': '2', 'language': 'es', 'text': 'Este ha sido un dia terrible, llegué tarde al trabajo debido a un accidente automobilistico.' },
  ]};

  let urlLiterature = "";

  switch (answer) {
    case "1":
    analyzeForSentiment(documents);
      break;
  
    case "2":
    analyzeForKeyPhrases(documents);
      break;
  
    case "3":
      writeBook();
      break;
  
    case "4":
    //Review submitten
    let reviewData = {
      "publisher" : "Peter Schmustig",
      "content" : "Ich fand die Stelle mit dem Meteoriten am besten. Heiß!"
    };

    urlLiterature = serverURL + 'literature/5be7062333aa071975bc344c';

    let literatureData = {
      "title" : "Der Hans ist nicht alleine.",
      "autor" : "Johnny Depp",
      "genre" : "Horror",
      "content" : "Doch er was wohl... Plötzlich, ein greller Blitz am Himmel!",
      "review" : reviewData
    };
    let options = {
      uri: urlLiterature,
      method: 'PUT',
      headers:{
        'Content-Type': 'application/json'
      },
      json : literatureData
    };

  request.put(options, function(err, response, body){
    if(err){
      console.log("Fehler: GET Request");
    }
    else {
      console.log(body); 
    }
  });

  var formattedReviewData = {
    "documents": [
        {
            "language": "de",
            "id": "1",
            "text": JSON.stringify(reviewData.content)
        }
    ]
}

  analyzeForSentiment(formattedReviewData);
  analyzeForKeyPhrases(formattedReviewData);
      break;
  
    case "5":
    urlLiterature = serverURL + 'literature';

    request.get(urlLiterature, function(err, response, body){
      if(err){
        console.log("Fehler: GET Request");
      }
      else {
        console.log(JSON.parse(body)); 
      }
    });
      break;
  
    default:
    console.log("Input unknown.");
      break;
  }
  rl.close();
});

function analyzeForSentiment(documents){

'use strict';

let path = '/text/analytics/v2.0/sentiment';

let response_handler = function (response) {
    let body = '';
    response.on ('data', function (d) {
        body += d;
    });
    response.on ('end', function () {
        let body_ = JSON.parse (body);
        let body__ = JSON.stringify (body_, null, '  ');
        console.log (body__);
    });
    response.on ('error', function (e) {
        console.log ('Error: ' + e.message);
    });
};

let get_sentiments = function (documents) {
    let body = JSON.stringify (documents);

    let request_params = {
        method : 'POST',
        hostname : azureUri,
        path : path,
        headers : {
            'Ocp-Apim-Subscription-Key' : azureAccessKey,
        }
    };

    let req = https.request (request_params, response_handler);
    req.write (body);
    req.end ();
}



get_sentiments (documents);
}

function analyzeForKeyPhrases(documents) {
  'use strict';

let path = '/text/analytics/v2.0/keyPhrases';

let response_handler = function (response) {
    let body = '';
    response.on ('data', function (d) {
        body += d;
    });
    response.on ('end', function () {
        let body_ = JSON.parse (body);
        let body__ = JSON.stringify (body_, null, '  ');
        console.log (body__);
    });
    response.on ('error', function (e) {
        console.log ('Error: ' + e.message);
    });
};

let get_key_phrases = function (documents) {
    let body = JSON.stringify (documents);

    let request_params = {
        method : 'POST',
        hostname : azureUri,
        path : path,
        headers : {
            'Ocp-Apim-Subscription-Key' : azureAccessKey,
        }
    };

    let req = https.request (request_params, response_handler);
    req.write (body);
    req.end ();
}

get_key_phrases (documents);
}

//--------------------- END OF PLAYGROUND -------------------------//


app.listen(3000, function(){
  console.log("Der Dienstnutzer ist nun auf Port 3000 verfügbar.");
});

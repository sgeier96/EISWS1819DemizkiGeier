var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');

const urlParams = new URLSearchParams(window.location.search);

var serverURL = 'http://localhost:8080/';
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

createLiterature(
  "Alice im Wunderland", 
  "Lewis Carroll", 
  "Kinderbuch", 
  "01.01.1865", 
  "Es war einmal vor langer langer Zeit...", 
  12
  );


//TODO Data given in in the Interface has yet to be passed to this function
/* 
* @param passedTitle The title of the literature to be created
* @param passedAuthor The author's name of the literature to be created
* @param passedGenre The genre of the literature to be created
* @param passedReleaseDate The release date of the literature to be created
* @param passedContent The main content of the literature to be created
* @param passedCallCount The count of how often the literature has already been called (not required)
*/
function createLiterature(passedTitle, passedAuthor, passedGenre, passedReleaseDate, passedContent, passedCallCount){
  let urlLiterature = serverURL + 'literatures';  
  let literatureData = {
    "title" : JSON.stringify(passedTitle),
    "author" : JSON.stringify(passedAuthor),
    "genre" : JSON.stringify(passedGenre),
    "releaseDate" : JSON.stringify(passedReleaseDate),
    "content" : JSON.stringify(passedContent)
    }
  let options = {
      uri: urlLiterature,
      body: JSON.stringify(literatureData),
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      }
    }

  request(options, function (err, res) {
    if (err) {
      console.log(err);
    } else {
      console.log('POST-Request send: \n ' + JSON.stringify(res, null, 2));
    }
  });
}



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
rl.question("Choose between: \n 1: Sentiment \n 2: Keywords \n 3: Submit a review \n 4: Show all books \n", function(answer) {

  let urlLiterature = "";

  switch (answer) {
    case "1":
    analyzeForSentiment(documents);
      break;
  
    case "2":
    analyzeForKeyPhrases(documents);
      break;
  
    case "3":
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
      "content" : "Doch er war es wohl... Plötzlich, ein greller Lichtblitz am Himmel!",
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
  
    case "4":
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

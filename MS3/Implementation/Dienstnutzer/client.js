var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');

var serverURL = 'http://localhost:8080/';
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


//CreateLiterature with sendReview after that
/*createLiterature(
  "Alice im Wunderland", 
  "Lewis Carroll", 
  "Kinderbuch", 
  "01.01.1865", 
  "Es war einmal vor langer langer Zeit...", 
  12
);*/

//sendReview('Nutzer123', 'Also ich finde die Literatur war wirklich sehr gut, besonders der Teil mit dem Motorrad hat mir sehr gut gefallen!', '5c3cc92baee5aa08fc9e7d6c');
//addSuggestionAsAdvice('Nutzer234', 'Das und das ist passiert.', '5c3cc92baee5aa08fc9e7d6c');



//TODO Data given in in the Interface has yet to be passed to this function

function createLiterature(passedTitle, passedAuthor, passedGenre, passedReleaseDate, passedContent, passedCallCount, callback) {
  let urlLiterature = serverURL + 'literatures';
  let literatureData = {
    "title": JSON.stringify(passedTitle),
    "author": JSON.stringify(passedAuthor),
    "genre": JSON.stringify(passedGenre),
    "releaseDate": JSON.stringify(passedReleaseDate),
    "content": JSON.stringify(passedContent)
  }

  if (passedCallCount != null) {
    literatureData.callCount = passedCallCount;
  }

  let options = {
    uri: urlLiterature,
    body: JSON.stringify(literatureData),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  request(options, function (err, res) {
    var createdLiterature = 'Not yet defined.';
    if (err) {
      console.log(err);
    } else {
      createdLiterature = JSON.parse(res.body);
    }
    return callback(createdLiterature);
  });
}

//TODO Save the current Literature that is being written a review of
//TODO Get or pass the ID of the current literature that is being written a review of
function sendReview(publisher, revContent, literatureId) {
  let urlLiterature = serverURL + 'literatures/' + literatureId;

  let options = {
    uri: urlLiterature,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    json: {
      reviews: {
        'publisher': publisher,
        'revContent': revContent
      }
      }
  }

  request.put(options, function (err, res) {
    if (err) {
      console.log(err);

    } else {
      console.log('[sendReview()] Got response.' + JSON.stringify(res.body.reviews, null, 2));
    }
  });

  /*--------------------------------------------------------------
  -- Google Cloud Natural Language API - Sentiment and Entities --
  --------------------------------------------------------------*/
  try {
    sentimentAnalysis(revContent).catch(console.error).then(function (sentimentResult) {
      entitiesAnalysis(revContent).catch(console.error).then(function (entitiesResult) {
        //console.log('ENTITIES with type of (' + typeof entitiesResult + '): \n' + entitiesResult[0].name);
        //console.log('SENTIMENT RESULT IS THE FOLLOWING: ' + typeof sentimentResult + '\n' + sentimentResult);
       let keyPhrases = [];

        entitiesResult.forEach(entity => {
          keyPhrases.push({
            phrase: entity.name,
            type: entity.type,
            salience: entity.salience
          });
        });

        let urlAnalyticalData = serverURL + 'analyticalData';
        let analyticalData = {
          "text": revContent,
          "literatureId": literatureId, //genre is retrieved by findById in analyticalDataRoute.js
          "keyPhrases": keyPhrases,
          "sentiment": {
            "score": sentimentResult.score,
            "magnitude": sentimentResult.magnitude
          },
          "sourceType": "review"
          //literatureHref is being written and entered in the respective xyzRoute.js after 
          //the prior (for genre retrievement) identification of the literature
        }

        let adOptions = {
          uri: urlAnalyticalData,
          //body: JSON.stringify(analyticalData),
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          json: analyticalData
        }

        request(adOptions, function (err, res) {
          if (err) {
            console.log(err);
          } else {
            console.log('[Sending Analytical Data] Got response.');
          }
        });
      }); // END OF entitiesAnalysis()
    }); // END OF sentimentAnalysis()
  } catch (error) {
    console.log('[Sentiment- & Entity-Analysis] ERROR: \n' + error)
  }


  async function sentimentAnalysis(textToAnalyze) {
    // Imports the Google Cloud client library
    const language = require('@google-cloud/language');

    // Instantiates a client
    const client = new language.LanguageServiceClient({
      projectId: 'eisws1819demizkigeier',
      keyFilename: './api/GoogleCloudNaturalLanguageAPI/EiSWS1819DemizkiGeier-0daa5216711f.json'
    });

    const document = {
      content: textToAnalyze,
      type: 'PLAIN_TEXT',
    };

    // Detects the sentiment of the text
    const [result] = await client.analyzeSentiment({
      document: document
    });
    const sentiment = result.documentSentiment;

    let sentimentResult = JSON.stringify(sentiment);
   
    return sentimentResult;
  }

  async function entitiesAnalysis(textToAnalyze) {
    // Imports the Google Cloud client library
    const language = require('@google-cloud/language');

    // Creates a client
    const client = new language.LanguageServiceClient({
      projectId: 'eisws1819demizkigeier',
      keyFilename: './api/GoogleCloudNaturalLanguageAPI/EiSWS1819DemizkiGeier-0daa5216711f.json'
    });

    // Prepares a document, representing the provided text
    const document = {
      content: textToAnalyze,
      type: 'PLAIN_TEXT',
    };

    // Detects entities in the document
    const [result] = await client.analyzeEntities({
      document
    });

    const entities = result.entities;

    return entitiesResult = entities;
  }
}

function addSuggestionAsAdvice(publisher, suggContent, literatureId){
  let adviceURL = serverURL + 'literatures/' + literatureId;

  let advOptions = {
    uri: adviceURL,
    method: 'PUT',
    headers:{
      'Content-Type' : 'application/json'
    },
    json: {
      advices: {
        'publisher' : publisher,
        'adviceContent' : suggContent
      }
    }
  }

  request(advOptions, function(err, res){
    if (err) {
      console.error;
    } else {
      console.log('[addSuggestionAsAdvice()] Got response: \n ' + JSON.stringify(res.body, null, 2));
    }
  });

  /*--------------------------------------------------------------
  -- Google Cloud Natural Language API - Sentiment and Entities --
  --------------------------------------------------------------*/
  try {
    sentimentAnalysis(suggContent).catch(console.error).then(function (sentimentResult) {
      entitiesAnalysis(suggContent).catch(console.error).then(function (entitiesResult) {
        //console.log('ENTITIES with type of (' + typeof entitiesResult + '): \n' + entitiesResult[0].name);
        //console.log('SENTIMENT RESULT IS THE FOLLOWING: ' + typeof sentimentResult + '\n' + sentimentResult);
       let keyPhrases = [];

        entitiesResult.forEach(entity => {
          keyPhrases.push({
            phrase: entity.name,
            type: entity.type,
            salience: entity.salience
          });
        });

        let urlAnalyticalData = serverURL + 'analyticalData';
        let analyticalData = {
          "text": suggContent,
          "literatureId": literatureId, //genre is retrieved by findById in analyticalDataRoute.js
          "keyPhrases": keyPhrases,
          "sentiment": {
            "score": sentimentResult.score,
            "magnitude": sentimentResult.magnitude
          },
          "sourceType": "suggestion"
          //literatureHref is being written and entered in the respective xyzRoute.js after 
          //the prior (for genre retrievement) identification of the literature
        }

        let adOptions = {
          uri: urlAnalyticalData,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          json: analyticalData
        }

        request(adOptions, function (err, res) {
          if (err) {
            console.log(err);
          } else {
            console.log('[Sending Analytical Data] Got response.');
          }
        });
      }); // END OF entitiesAnalysis()
    }); // END OF sentimentAnalysis()
  } catch (error) {
    console.log('[Sentiment- & Entity-Analysis] ERROR: \n' + error)
  }

  async function sentimentAnalysis(textToAnalyze) {
    // Imports the Google Cloud client library
    const language = require('@google-cloud/language');

    // Instantiates a client
    const client = new language.LanguageServiceClient({
      projectId: 'eisws1819demizkigeier',
      keyFilename: './api/GoogleCloudNaturalLanguageAPI/EiSWS1819DemizkiGeier-0daa5216711f.json'
    });

    const document = {
      content: textToAnalyze,
      type: 'PLAIN_TEXT',
    };

    // Detects the sentiment of the text
    const [result] = await client.analyzeSentiment({
      document: document
    });
    const sentiment = result.documentSentiment;

    let sentimentResult = JSON.stringify(sentiment);
   
    return sentimentResult;
  }

  async function entitiesAnalysis(textToAnalyze) {
    // Imports the Google Cloud client library
    const language = require('@google-cloud/language');

    // Creates a client
    const client = new language.LanguageServiceClient({
      projectId: 'eisws1819demizkigeier',
      keyFilename: './api/GoogleCloudNaturalLanguageAPI/EiSWS1819DemizkiGeier-0daa5216711f.json'
    });

    // Prepares a document, representing the provided text
    const document = {
      content: textToAnalyze,
      type: 'PLAIN_TEXT',
    };

    // Detects entities in the document
    const [result] = await client.analyzeEntities({
      document
    });

    const entities = result.entities;

    return entitiesResult = entities;
  }

  
}

app.listen(3000, function () {
  console.log("Der Dienstnutzer ist nun auf Port 3000 verfügbar.");
});
//var request = require('request');

//_____________________________ START LOG IN ___________________________________//
function login(){
  var userURL = 'http://localhost:8080/user';
  var email  = document.getElementById('email');                                //Der Sicherheitsaspekt wird nicht berücksichtigt!
  var password  = document.getElementById('password');

  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function(){
    if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
      var userArray = JSON.parse(xmlhttp.responseText);

      for (var i = 0; i < userArray.length; i++){
          if (userArray[i].email == email.value && userArray[i].password == password.value){
            alert("Login erfolgreich!");
            window.location = "./homepage.html";
          }
      }
      alert("Die Email oder das Passwort sind nicht kor­rekt!");
      window.location = "./login.html";
    }
  }
  xmlhttp.open("GET", userURL, false);                                          //Synchron
  xmlhttp.send();
}
//_______________________________ END LOG IN ___________________________________//

//_____________________________ START TRENDS ___________________________________//
window.onload = function (){
  var trendURL = 'http://localhost:8080/trends';

  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function(){
    if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
      var trendsArray = JSON.parse(xmlhttp.responseText);
      var trendHtml = '<table border = "0">';

      for (var i = 0; i < trendsArray.length; i++) {
        trendHtml += '<tr><td><img src="../images/Buchcover02.png" alt="Buchcover"></td></tr> <tr><td>' + '<a href = "homepage.html">' + trendsArray[i].title  + '</td></tr>';
      }
      trendHtml += '</table>';
      document.getElementById("trendlist").innerHTML = trendHtml;
    }
  }
  xmlhttp.open("GET", trendURL, true);                                          // Asynchron
  xmlhttp.send();
}
//_______________________________ END TRENDS ___________________________________//

//sendReview('NutzerSentiment', '5Also ich finde die Literatur war wirklich sehr gut, besonders der Teil mit dem Motorrad hat mir sehr gut gefallen!', '5c3cc92baee5aa08fc9e7d6c');

//TODO Data given in in the Interface has yet to be passed to this function
/*
 * @param passedTitle The title of the literature to be created
 * @param passedAuthor The author's name of the literature to be created
 * @param passedGenre The genre of the literature to be created
 * @param passedReleaseDate The release date of the literatur e to be created
 * @param passedContent The main content of the literature to be created
 * @param passedCallCount The count of how often the literature has already been called (not required)
 */

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
  let newReview = {
    "reviews": {
      "publisher": publisher,
      "revContent": revContent
    }
  }
  let options = {
    uri: urlLiterature,
    body: JSON.stringify(newReview),
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  request.put(options, function (err, res) {
    if (err) {
      console.log(err);

    } else {
      console.log('PUT-Request for adding a review send.');
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
          "revContent": revContent,
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

        //console.log(JSON.stringify(adOptions.json.keyPhrases[1].phrase, null, 2));

        request(adOptions, function (err, res) {
          if (err) {
            console.log(err);
          } else {
            console.log('POST-Request for analyticalData send.');
          }
        });
      }); // END OF entitiesAnalysis()
    }); // END OF sentimentAnalysis()
  } catch (error) {
    console.log('ERROR AT SENTIMENT AND ENTITY ANALYSIS: \n' + error)
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
/*
app.listen(3000, function () {
  console.log("Der Dienstnutzer ist nun auf Port 3000 verfügbar.");
});
*/

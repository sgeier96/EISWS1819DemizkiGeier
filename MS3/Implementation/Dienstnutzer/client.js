//var request = require('request');                                             //Zum testen notwendig gewesen
//_____________________________ START LOG IN ___________________________________
function login(){
  var userURL = 'https://eisws1819demizkigeier.herokuapp.com/user';
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
//_______________________________ END LOG IN ___________________________________

//_____________________________ START TRENDS ___________________________________
function loadTrends(){
  var trendURL = 'https://eisws1819demizkigeier.herokuapp.com/trends';

  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function(){
    if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
      var trendsArray = JSON.parse(xmlhttp.responseText);
      var trendHtml = '<table border = "0">';

      for (var i = 0; i < trendsArray.length; i++) {
        trendHtml += '<tr><td><img src="../images/Buchcover02.png" alt="Buchcover"></td></tr> <tr><td>' + '<a href = "booksite.html?bookID='+ trendsArray[i]._id + '">' + trendsArray[i].title  + '</td></tr>';
      }
      trendHtml += '</table>';
      document.getElementById("trendlist").innerHTML = trendHtml;
    }
  }
  xmlhttp.open("GET", trendURL, true);                                          // Asynchron
  xmlhttp.send();
}
//_______________________________ END TRENDS ___________________________________

//___________________________ START loadBookData _______________________________
function loadBookData(){
  var url = new URL(window.location);
  var param = new URLSearchParams(url.search);
  var bookID = url.searchParams.get("bookID");

  var literaturURL = 'https://eisws1819demizkigeier.herokuapp.com/literatures/' + bookID;

  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function(){
    if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
      var book = JSON.parse(xmlhttp.responseText);

      document.getElementById("bookTitle").innerHTML = book.title;
      document.getElementById("author").innerHTML = book.author;
      document.getElementById("genre").innerHTML = book.genre;
      document.getElementById("descriptionText").innerHTML = book.content;
      document.getElementById("bookPrice").innerHTML = book.price;

      document.getElementById("dialogboxTitle").innerHTML = book.title;
      document.getElementById("dialogboxAuthor").innerHTML = book.author;
      document.getElementById("dialogboxGenre").innerHTML = book.genre;
    }
  }
  xmlhttp.open("GET", literaturURL, true);                                      // Asynchron
  xmlhttp.send();
}
//____________________________ END loadBookData ________________________________

//_________________________ START Review dialogbox _____________________________//Modal entnommen aus https://www.w3schools.com
function createReview() {
    // Get the modal
  var modal = document.getElementById('dialogbox');

  // Get the button that opens the modal
  var btn = document.getElementById("bookReview");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  modal.style.display = "block";

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}
//____________________________ END loadBookData ________________________________

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
  let serverURL = 'https://eisws1819demizkigeier.herokuapp.com/';
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

function sendReview() {
  let url = new URL(window.location);
  let param = new URLSearchParams(url.search);
  let bookID = url.searchParams.get("bookID");
  let literaturURL = 'https://eisws1819demizkigeier.herokuapp.com/literatures/' + bookID;
  let revContent = document.getElementById("reviewContent").value;

  let newReview = {
    "reviews": [{
      "publisher": "testUser",                                                  //To do: Richtigen User automatisch eintragen.
      "revContent": revContent
    }]
  }
  var http = require("http");                                                   //To do: PUT request clientseitig geht nicht.
  var options = {
    host: "https://eisws1819demizkigeier.herokuapp.com",
    path: "/literatures/" + bookID,
    method: "PUT"
  };
}

function oldsendReview(){
  let serverURL = 'https://eisws1819demizkigeier.herokuapp.com/';
  let urlLiterature = serverURL + 'literatures/' + literatureId;
  let newReview = {
    "reviews": {
      "publisher": publisher,
      "revContent": revContent
    }
  }

  let options = {
    uri: literaturURL,
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

/*                                                                              // Zum Testen
app.listen(3000, function () {
  console.log("Der Dienstnutzer ist nun auf Port 3000 verfügbar.");
});
*/

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');

var serverURL = 'http://localhost:8080/';
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//CreateLiterature with postReview after that
/*createLiterature(
  "Alice im Wunderland", 
  "Lewis Carroll", 
  "Kinderbuch", 
  "01.01.1865", 
  "Es war einmal vor langer langer Zeit...", 
  12, function(response){
    console.log('ID of created literature: ' + JSON.stringify(response._id));
    //postReview('Nutzer123', 'Wahnsinns Buch. Wortwörtlich.', response._id)
  }
);*/

//postReview('Nutzer234', 'Coolio.', '5c3cc92baee5aa08fc9e7d6c');
  



//TODO Data given in in the Interface has yet to be passed to this function
/* 
* @param passedTitle The title of the literature to be created
* @param passedAuthor The author's name of the literature to be created
* @param passedGenre The genre of the literature to be created
* @param passedReleaseDate The release date of the literatur e to be created
* @param passedContent The main content of the literature to be created
* @param passedCallCount The count of how often the literature has already been called (not required)
*/
function createLiterature(passedTitle, passedAuthor, passedGenre, passedReleaseDate, passedContent, passedCallCount, callback){
  let urlLiterature = serverURL + 'literatures';  
  let literatureData = {
    "title" : JSON.stringify(passedTitle),
    "author" : JSON.stringify(passedAuthor),
    "genre" : JSON.stringify(passedGenre),
    "releaseDate" : JSON.stringify(passedReleaseDate),
    "content" : JSON.stringify(passedContent)
    }

    if(passedCallCount != null){
      literatureData.callCount = passedCallCount;
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
function postReview(publisher, revContent, literatureId){
  let urlLiterature = serverURL + 'literatures/' + literatureId;
  let newReview = { 
    "reviews" : {
      "publisher" : publisher,
      "revContent" : revContent
    }
  }
let options={
    uri: urlLiterature,
    body: JSON.stringify(newReview),
    method: 'PUT',
    headers: {
      'Content-Type' : 'application/json'
    }
  }

  request.put(options, function(err, res){
    if (err) {
      console.log(err);
      
    } else {
      console.log('PUT-Request send. New Literature: \n ' + JSON.stringify(res, null, 2));
    }
  })
}





app.listen(3000, function(){
  console.log("Der Dienstnutzer ist nun auf Port 3000 verfügbar.");
});

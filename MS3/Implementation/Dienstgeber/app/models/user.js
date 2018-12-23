var mongoose    = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    //userID: {type: Number, unique: true, required: true}, //Primärschlüssel
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, lowercase: true, required: true}, //Konvertiert E-Mail stets in Kleinbuchstaben
    birthday: Date,
    ownedBooks: [], //Bücher, die dem Nutzer (innerhalb des Systems) gehören
    lastRead: [],   //Bücher, die der Nutzer zuletzt mit dem System gelesen hat
    authoredBooks:[ //Vom Nutzer geschriebene Bücher (mithilfe des Systems)
        {bookID: {type: Number, unique: true, required:true}},
        {state: String, required: true},    //WorkInProgress, Veröffentlicht, etc.
    ],
    participatedBooks: [],      //Bücher, in dessen Vorschläge des Nutzers umgesetzt wurden
    helpfulSuggestions: [],     //Vorschläge, die andere Autoren als "hilfreich" markiert haben
    points: {type: Number, default: 0}, //Systeminternes Punkte-/Währungssystem
    attendedCourses: [],        //Vom Nutzer besuchte Kurse 
    favouriteGenres: [String],  //Lieblingsgenres des Nutzers
    specifiedInterests: [],     //Vom Nutzer angegebene Interessen (Bücher, Genres, etc?)
    calculatedInterests: [],    //Vom System kalkulierte Interessen
});

module.exports = mongoose.model('User', userSchema);
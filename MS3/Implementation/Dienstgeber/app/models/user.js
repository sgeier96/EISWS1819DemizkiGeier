var mongoose    = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    //userID: {type: Number, unique: true, required: true}, //Primärschlüssel
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, lowercase: true, required: true, unique: true, dropDups: true}, //Konvertiert E-Mail stets in Kleinbuchstaben
    password: {type: String, require: true},
    birthday: Date,
    ownedBooks: [ //Bücher, die dem Nutzer (innerhalb des Systems) gehören
        {href: String}    //Verweisung auf entsprechende(s) Buch/Bücher
    ],
    lastRead: [   //Bücher, die der Nutzer zuletzt mit dem System gelesen hat
        {href: String}    //Verweisung auf entsprechende(s) Buch/Bücher
    ],
    authoredBooks:[ //Vom Nutzer geschriebene Bücher (mithilfe des Systems)
        {href: String}    //Verweisung auf entsprechende(s) Buch/Bücher
    ],
    participatedBooks: [    //Bücher, in dessen Vorschläge des Nutzers umgesetzt wurden
        {href: String}      //Verweisung auf entsprechende(s) Buch/Bücher
    ],
    //helpfulSuggestions: [],  //Vorschläge, die andere Autoren als "hilfreich" markiert haben
    points: {type: Number, default: 0}, //Systeminternes Punkte-/Währungssystem
    attendedCourses: [       //Vom Nutzer besuchte Kurse
        {type: String}
    ],
    favouriteGenres: [String],  //Lieblingsgenres des Nutzers
    //specifiedInterests: [],     //Vom Nutzer angegebene Interessen (Bücher, Genres, etc?)
    //calculatedInterests: [],    //Vom System kalkulierte Interessen
});

module.exports = mongoose.model('User', userSchema);

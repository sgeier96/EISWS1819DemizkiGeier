var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var literatureSchema = new Schema({
    title: {type: String, required: true},
    autor: {type: String, required: true},
    genre: {type: String, required: true},
    releaseDate: {type: String, required: true},
    content: {type: String, required: true},
    callCount: {type: Number, required: true},                                  // Aufrufzahlen : Für die Trendermittlung
    review: [{
      publisher: {type: String, required: true},
      content: {type: String, required: true}
    }],
    like: {type: Number},
    dislike: {type: Number}
});

module.exports = mongoose.model('Literature', literatureSchema);

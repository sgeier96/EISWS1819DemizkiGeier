var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var literatureSchema = new Schema({
    title: {type: String, required: true},
    author: {type: String, required: true},
    genre: {type: String, required: true},
    releaseDate: {type: String, required: true},
    content: {type: String, required: true},
    callCount: {type: Number, default: 0},                                  // Aufrufzahlen : Für die Trendermittlung
    reviews: [{
      publisher: {type: String, required: true},
      content: {type: String, required: true}
    }],
    like: {type: Number},
    dislike: {type: Number}
});

module.exports = mongoose.model('Literature', literatureSchema);

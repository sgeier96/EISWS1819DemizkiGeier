var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var literatureSchema = new Schema({
  title: {type: String },
  author: {type: String },
  genre: {type: String },
  releaseDate: {type: String },
  content: {type: String },
  price: {type: Number},
  callCount: {type: Number, default: 0},                                        // Aufrufzahlen : Für die Trendermittlung
  reviews: [{
    publisher: String,
    revContent: String
  }],
  like: {type: Number},
  dislike: {type: Number}
});


module.exports = mongoose.model('Literature', literatureSchema);

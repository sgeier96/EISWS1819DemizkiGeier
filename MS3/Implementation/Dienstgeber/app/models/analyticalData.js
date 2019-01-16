var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var analyticalDataSchema = new Schema({
  text: String,    
  genre: String,
  sentiment: {
    score: String,
    magnitude: String
  },
  keyPhrases: [{
    phrase: {type: String},
    type: {type: String},
    salience: {type: Number}
  }],
  sourceType: String,
  literatureHref: String
});

module.exports = mongoose.model('AnalyticalData', analyticalDataSchema);
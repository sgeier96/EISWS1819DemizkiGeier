var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var analyticalData = new Schema({
    genre: String,
    sentiment: String,
    keyPhrases: [{
      key: String
    }]
});

module.exports = mongoose.model('AnalyticalData', analyticalData);

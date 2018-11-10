var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var literatureSchema = new Schema({
    title: String,
    autor: String,
    genre: String,
    content: String,
    review: [{
      publisher: String,
      content: String
    }]
});

module.exports = mongoose.model('Literature', literatureSchema);

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var rezensionSchema = new Schema({
    inhalt: String,
    buchID: String,
    verlegerID: String
});

module.exports = mongoose.model('Rezension', rezensionSchema);

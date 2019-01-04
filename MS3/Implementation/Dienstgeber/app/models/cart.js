var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var cartSchema = new Schema({
    user: {type: String, required: true},
    items: [{
      title: {type: String, required: true},
      amount: {type: Number, required: true},
      itemPrice: {type: Number, required: true}
    }]
});

module.exports = mongoose.model('Cart', cartSchema);

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var orderSchema = new Schema({
    user: {type: String, required: true},
    items: [{
      title: {type: String, required: true},
      amount: {type: Number, required: true},
      itemPrice: {type: Number, required: true}
    }]
    //wholePrice: Number
});

module.exports = mongoose.model('Order', orderSchema);

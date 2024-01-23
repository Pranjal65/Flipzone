const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  quantity: {
    type: Number, 
    default: 0,
  },
  price: {
    type: Number,
    required: true,
  },
});

const CartItem = mongoose.model('CartItem', cartSchema);

module.exports = CartItem;

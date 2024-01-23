const express = require('express');
const CartItem = require('../models/cartModel.js');
const authenticateToken = require('../middlewares/authenticationToken.js');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Product =require('../models/product.js')
const router = express.Router();


router.post('/add-to-cart', authenticateToken, async (req, res) => {
  try {
    const productId = req.body._id.$oid;
    const userId = req.user._id;
    const mongooseProductId=new ObjectId (productId); 
    const existingCartItem = await CartItem.findOne({ userId: userId, productId:  mongooseProductId });

    if (existingCartItem) {
      if(existingCartItem.quantity===10){
        return res.json({ message: 'Quantity Limit exceeded' });
      }
      await CartItem.updateOne({ _id: existingCartItem._id }, { $inc: { quantity: 1 } });
      return res.json({ message: 'Quantity updated in the cart' });
    } else {
      const product= await Product.findOne({_id: mongooseProductId})
      if(!product){
        return reps.send({ message: 'Product not found'});
      }
      const cartItem = new CartItem({
        userId: userId,
        productId: mongooseProductId,
        quantity: 1,
        price:product.price
      });

      await cartItem.save();
      return res.json({ message: 'Product added to cart' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user._id; 

  try {
    const cartItems = await CartItem.find({userId:userId});
    return res.json(cartItems);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.delete('/:id', authenticateToken, async (req, res) => {
  const name = req.params.id.trim();
  const userId = req.user._id; 
  try {
    const cartItem = await CartItem.findOne({ userId:userId,productId:name});
    if (!cartItem) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }
    if (cartItem.quantity > 1) {
      await CartItem.updateOne({ _id:cartItem.id, productId: name }, { $inc: { quantity: -1 } });
      return  res.json({ message: 'Quantity decreased in the cart' });
    } else {
      await CartItem.findOneAndDelete({ productId: name });
      return  res.json({ message: 'Product removed from cart' });
    }
  } catch (error) {
    console.error(error);
    return  res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;

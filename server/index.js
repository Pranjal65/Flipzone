const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');
const userRoute = require('./routes/userRoutes.js');
//const cors = require('cors');
const cartRoute = require('./routes/cartRoutes.js');



const app = express();
const port = 5000;


mongoose.connect('mongodb://127.0.0.1/Flipzone');
//app.use(cors());
app.use(express.json());

app.use('/api/auth',userRoute);
app.use('/api/products', productRoutes);
app.use('/cart', cartRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);

});

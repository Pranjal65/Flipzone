const express = require('express');
const router = new express.Router();
const userServices = require( '../services/userServices.js');


router.post('/register',userServices.UserRegistration);


router.post('/login',userServices.userLogin);
 //export default router;
 module.exports = router;
const express = require('express');
const multer  = require('multer')
const Aploads = multer({ dest: 'uploads/' })
const router = express.Router();
const userscontroller=require('../controller/users.controller');
const authorizeToken = require('../middleware/authorization_taken');
//get all users 

// register users 

//login users 
 
router.route('/')
.get(authorizeToken,userscontroller.getallusers);

router.route('/register')
.post(Aploads.single('Avatar'),userscontroller.register);

router.route('/login')
.post(userscontroller.login);
module.exports = router;

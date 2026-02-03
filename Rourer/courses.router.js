const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authorization_taken=require('../middleware/authorization_taken')
const AllowedTo=require('../middleware/AllowedTo')


const {
  AddCourse,
  getallcourses,
  getcourse,
  EditCourse,
  DeleteCourse
} = require('../controller/courses.controller');

const { ValidationSchema } = require('../middleware/validationSchema');
const authorizeToken = require('../middleware/authorization_taken');
const UserRole = require('../Utills/userRole');


router.get('/', getallcourses);

router.post(
  '/',                    
  ValidationSchema(),      
   
  authorizeToken,AllowedTo(UserRole.Manger),AddCourse             
);


router.route('/:courseid')
  .get(getcourse)
  .patch(EditCourse)
  .delete(authorizeToken,AllowedTo(UserRole.Admin,UserRole.Manger),DeleteCourse);
  
 

module.exports = router;

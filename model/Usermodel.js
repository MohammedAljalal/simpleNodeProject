const mongoose = require('mongoose');
const validator = require('validator');
const UserRole=require('../Utills/userRole')

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },

    lastName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Field must be a valid email address']
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },
    
  token:
  {
   type: String
  },
  Role:
  {
    type:String ,//[user,admin,manager]
    enum:[UserRole.User,UserRole.Admin,UserRole.Manger],
    default:UserRole.User
  },
  isLoggedIn: {
     type: Boolean, default: false 

  },
  Avatar:{
    type: String,
    default:'../Aploads/user1.jpg'
  }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', UserSchema);

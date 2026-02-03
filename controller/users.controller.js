
const { Hyperparameter } = require('sklearn');
require('dotenv').config();
const asyncWrapper=require('../middleware/asyncWrapper');
const Users =require('../model/Usermodel');
const httpststusText=require('../Utills/httpststusText');
const AppError=require('../Utills/apperror')
const bcrypt=require('bcryptjs');
const { message } = require('../Utills/apperror');
const generateJwt=require('../Utills/generateJwt');
const { User } = require('../Utills/userRole');
const UserRole = require('../Utills/userRole');
const getallusers=asyncWrapper(
async(req,res)=>{
    const query = req.query;
    console.log("query",query);
    const limit=query.limit||30;
    const page=query.page||1;
    const skip=(page-1)*limit;

   const users=await Users.find({},{
    "__v":false,"password":false
   }).limit(limit).skip(skip);
res.send(JSON.stringify({status:httpststusText.SUCCESS,data:{users}}));
});


const register=asyncWrapper(async(req,res)=>{
    console.log(req.body)
    const {firstName,lastName,email,password,Role}=req.body;
    const olduser=await Users.findOne({email:email});
    if(olduser){
        return res.status(404).json({status:httpststusText.ERROR,data:{message:'this user is already exist '}})
    }
//hashing the password
const hashedpassword=await bcrypt.hash(password,10)
      const newuser=new Users({
        firstName,
        lastName,
        email,
        password:hashedpassword,
        Role:Role||'User'
      
        
        
    })
    //generate json web taken for user
     const token=await generateJwt({email:newuser.email,id:newuser.id,Role:newuser.Role});
     newuser.token=token;
    await newuser.save();
    return res.status(201).json({status:httpststusText.SUCCESS,token,data:{user:newuser}});

})
const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: httpststusText.FAIL,
      message: "Email and password are required"
    });
  }

 
  const user = await Users.findOne({ email });
  if (!user) {
    return res.status(404).json({
      status: httpststusText.FAIL,
      message: "User not found"
    });
  }

  
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).json({
      status: httpststusText.FAIL,
      message: "Invalid email or password"
    });
  }

  if (user.isLoggedIn) {
    return res.status(400).json({
      status: httpststusText.FAIL,
      message: "User already logged in"
    });
  }


  user.isLoggedIn = true;
  await user.save();

  
  const token = await generateJwt({
    id: user._id,
    email: user.email,
    Role: user.Role
  });


  return res.status(200).json({
    status: httpststusText.SUCCESS,
    message: "Logged in successfully",
    data: { token }
  });
});


module.exports={
getallusers,
register,
login
}
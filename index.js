require('dotenv').config()
const express=require('express');
const Path=require('path')
const cors=require('cors');
const httpststusText=require('./Utills/httpststusText')
const app=express();
app.use('/Aploads',express.static(Path.join(__dirname,'Aploads')))
const mongoose=require('mongoose');
const url = process.env.MONGO_URL;
console.log(url);
mongoose.connect((url)).then(()=>{
    console.log("mongodb server start");
})

const {body,validationResult}=require('express-validator')
app.use(cors());
app.use(express.json());
const coursesRouer=require('./Rourer/courses.router');
const usersrouter=require('./Rourer/Users.model');
app.use('/courses',coursesRouer);
app.use('/users',usersrouter)

 app.use((req, res) => {
  res.status(error.statuscode||500).json(
   {
    status:httpststusText.SUCCESS,
    message: 'This Resource Not Available ',
    code:404
  });
});

app.use((error, req, res, next) => {
  res.status(500).json({
    status:httpststusText.ERROR,message:error.message
  });
});

app.listen(process.env.port||4000,()=>{
    console.log('listening on port' +process.env.port)
})
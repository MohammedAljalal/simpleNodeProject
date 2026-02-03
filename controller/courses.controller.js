const { Message } = require('@mui/icons-material');
const coursess=require('../model/course.model');
const httpststusText=require('../Utills/httpststusText');
const {body,validationResult}=require('express-validator');
const asyncWrapper = require('../middleware/asyncWrapper');
const AppError=require('../Utills/apperror')
// function to veiw all courses
const getallcourses=asyncWrapper(
async(req,res)=>{
    const query = req.query;
    console.log("query",query);
    const limit=query.limit||1;
    const page=query.page||1;
    const skip=(page-1)*limit;

   const courses=await coursess.find({},{
    "__v":false
   }).limit(limit).skip(skip);
res.send(JSON.stringify({status:httpststusText.SUCCESS,data:{courses}}));
});

// function to view single course
const getcourse=asyncWrapper(
async(req,res,next)=>{
  const course=await coursess.findById(req.params.courseid);
if(!course){
    const error=new Error();
    AppError.create("course not Found",404,httpststusText.FAIL)
    return next(error);
    return res.status(404).send(JSON.stringify(({status:httpststusText.FAIL,data:{course:"corse not found"}})));
}
res.json({status:httpststusText.SUCCESS,data:{course}});
});

const AddCourse = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: httpststusText.ERROR,
        data: null,
        message: errors.array(),
        code: 400
      });
    }

    const newCourse = new coursess({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      createdBy: req.user.id,      
      roleCreated: req.user.role  
    });

    await newCourse.save();

    return res.status(201).json({
      status: httpststusText.SUCCESS,
      data: { newCourse }
    });

  } catch (err) {
    return res.status(500).json({
      status: httpststusText.ERROR,
      message: "Failed to create course"
    });
  }
};

//function  edit course
const EditCourse=async(req,res)=>{
       const courseId = req.params.courseid;
       const updates = req.body;
       const updatedCourse = await coursess.findByIdAndUpdate(courseId, updates, {$set: {...req.body}});


        if(!updatedCourse){
    return res.status(404).send(JSON.stringify(({status:httpststusText.FAIL,data:{updatedCourse:null}})));
}

res.status(200).json({status:httpststusText.SUCCESS,data:{updatedCourse}});

}

//function to delete course

const DeleteCourse = async (req, res) => {
  try {
    const course = await coursess.findById(req.params.courseid);
    
    if (!course) {
      return res.status(404).json({
        status: httpststusText.FAIL,
        data: { course: "course not found" }
      });
    }

    await coursess.deleteOne({ _id: course._id });

    return res.status(200).json({
      status: httpststusText.SUCCESS,
      data: null
    });

  } catch (error) {
    console.error("DeleteCourse Error:", error);
    return res.status(500).json({
      status: httpststusText.FAIL,
      data: { message: "Internal server error" }
    });
  }
};


module.exports={
    getallcourses,
    getcourse,
    AddCourse,
    EditCourse,
    DeleteCourse
}
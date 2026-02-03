module.exports=(asyncgetcourse)=>{
    return (req,res,next)=>{
        asyncgetcourse(req,res,next).catch((err)=>{
            next(err);
        });
    }
    
}
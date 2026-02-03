class AppError extends Error{
    constructor(){
        super();
    }
    catch(message,statuscode,statustext){
        this.message=message;
        this.statuscode=statuscode;
        this.statustext=statustext;
        return this;
    }
}
module.exports=new AppError();
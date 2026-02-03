const apperror = require('../Utills/apperror');

module.exports = (...Roles) => {
  return (req, res, next) => {

   
    if (!req.user || !req.user.Role) {
      return next(
        apperror.catch(
          'User role not found',
          401,
          'fail'
        )
      );
    }


    if (!Roles.includes(req.user.Role)) {
      return next(
        apperror.catch(
          'This role is not authorized',
          403,
          'fail'
        )
      );
    }

    next();
  };
};

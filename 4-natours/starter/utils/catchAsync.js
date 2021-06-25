/* eslint-disable arrow-body-style */
/* This will handle all asynchronous middlewares */
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
    //global error handling middleware
  };
};

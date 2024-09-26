const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
      return next();
    } else {
      res.redirect('/admin/login');
    }
  };
  
  module.exports = { isAuthenticated };
  
const db = require('../models');

let auth = (req, res, next) => {
  let token = req.cookies.w_auth;
  console.log(token);

  db.User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user)
      return res.json({
        isAuth: false,
        error: true,
        message: "You need to be login"
      });

    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = auth;
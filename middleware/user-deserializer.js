const User = require('../models/user');

const userDeserializer = (req, res, next) => {
  const userId = req.session.userId;
  if (userId) {
    User.findById(userId)
      .then((user) => {
        req.user = user;
        res.locals.user = user;
        next();
      })
      .catch((err) => next(err));
  } else {
    next();
  }
};

module.exports = userDeserializer;

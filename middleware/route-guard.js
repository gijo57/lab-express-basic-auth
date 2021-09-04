const routeGuard = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    const err = new Error('UNAUTHORIZED');
    err.status = 403;
    next(err);
  }
};

module.exports = routeGuard;

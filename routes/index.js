const { Router } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const routeGuard = require('../middleware/route-guard');
const router = Router();

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/register', (req, res, next) => {
  res.render('register');
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.get('/main', routeGuard, (req, res, next) => {
  res.render('main');
});

router.get('/private', routeGuard, (req, res, next) => {
  res.render('private');
});

router.get('/profile', routeGuard, (req, res, next) => {
  res.render('profile');
});

router.post('/register', (req, res, next) => {
  const { username, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((passwordHash) => {
      return User.create({
        username,
        passwordHash
      });
    })
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => next(err));
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  let user;
  User.findOne({ username })
    .then((document) => {
      user = document;
      if (!user) {
        throw new Error('NO_USER_FOUND');
      } else {
        return bcrypt.compare(password, user.passwordHash);
      }
    })
    .then((correctPassword) => {
      if (correctPassword) {
        req.session.userId = user._id;
        res.redirect('/');
      } else {
        throw new Error('WRONG_USERNAME_OR_PASSWORD');
      }
    })
    .catch((err) => next(err));
});

router.get('/profile/edit', routeGuard, (req, res, next) => {
  res.render('profile', { form: true });
});

router.post('/profile/edit', routeGuard, (req, res, next) => {
  const name = req.body.name;
  const id = req.user.id;
  console.log('id', id);
  User.findByIdAndUpdate({ _id: id }, { name })
    .then(() => {
      res.redirect('/profile');
    })
    .catch((err) => next(err));
});

router.post('/logout', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;

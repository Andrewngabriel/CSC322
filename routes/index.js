const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mid = require('../middleware');

router.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

router.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

router.get('/order', (req, res) => {
  res.render('order', { title: 'About' });
});

router.get('/complain', (req, res) => {
  res.render('complain', { title: 'Complain' });
});

router.get('/profile', mid.requiresLogin, (req, res) => {
  User.findById(req.session.userId).exec((err, user) => {
    if (err) {
      next(err);
    } else {
      res.render('profile', {
        title: 'Profile',
        name: user.name,
        address: user.address
      });
    }
  });
});

router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

router.post('/login', (req, res, next) => {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, (err, user) => {
      if (err || !user) {
        const err = new Error('Wrong email or password');
        err.status = 401;
        next(err);
      } else {
        req.session.userId = user._id;
        res.redirect('/profile');
      }
    });
  } else {
    const err = new Error('Email and password are required');
    err.status = 401;
    next(err);
  }
});

router.get('/signup', mid.loggedOut, (req, res) => {
  res.render('signup', { title: 'Sign up' });
});

router.post('/signup', (req, res) => {
  let email = req.body.email;
  let name = req.body.name;
  let address = req.body.address;
  let password = req.body.password;

  if (email && name && address && password) {
    const userData = {
      email: email,
      name: name,
      address: address,
      password: password
    };

    User.create(userData, (err, user) => {
      if (err) {
        next(err);
      } else {
        req.session.userId = user._id;
        res.redirect('/profile');
      }
    });
  } else {
    const err = new Error('All fields requires.');
    err.status = 400;
    next(err);
  }
});

router.get('/logout', (req, res, next) => {
  if (req.session) {
    // delete session object
    req.session.destroy(err => {
      if (err) {
        next(err);
      } else {
        res.redirect('/');
      }
    });
  }
});

module.exports = router;

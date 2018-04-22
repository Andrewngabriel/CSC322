const express = require('express');
const router = express.Router();
//const User = require('../models/user');
const Customer = require('../models/customer');
const Order = require('../models/order');
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

router.post('/order', (req, res, next) => {
  let pizzaSize = req.body.pizzaSize;
  let toppings = req.body.toppings;

  if (pizzaSize && toppings) {
    const orderData = {
      date: Date.now,
      customerId: req.session.userId,
      customerAddress: req.session.address,
      pizzaSize: pizzaSize,
      pizzaToppings: toppings
    };
    Order.create(orderData, (err, order) => {
      if (err) {
        next(err);
      } else {
        res.redirect('/');
      }
    });
  } else {
    const err = new Error('All fields required.');
    err.status = 400;
    next(err);
  }
});

router.get('/complain', mid.requiresLogin, (req, res) => {
  res.render('complain', { title: 'Complain' });
});

router.get('/profile', mid.requiresLogin, (req, res) => {
  Customer.findById(req.session.userId).exec((err, user) => {
    if (err) {
      next(err);
    } else {
      res.render('profile', {
        title: 'Profile',
        name: user.name,
        address: user.address,
        accountType: user.accountType,
        rating: user.rating
      });
    }
  });
});

router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

router.post('/login', (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  let accountType = req.body.accountType;
  if (email && password && accountType) {
    Customer.authenticate(email, password, accountType, (err, user) => {
      if (err || !user) {
        const err = new Error('Wrong email or password or account type');
        err.status = 401;
        next(err);
      } else {
        req.session.userId = user._id;
        req.session.address = user.address;
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

router.post('/signup', (req, res, next) => {
  let email = req.body.email;
  let name = req.body.name;
  let accountType = req.body.accountType;
  let address = req.body.address;
  let password = req.body.password;

  if (email && name && address && password && accountType) {
    const userData = {
      email: email,
      name: name,
      address: address,
      password: password,
      accountType: accountType
    };

    Customer.create(userData, (err, user) => {
      if (err) {
        next(err);
      } else {
        req.session.userId = user._id;
        res.redirect('/profile');
      }
    });
  } else {
    const err = new Error('All fields required.');
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

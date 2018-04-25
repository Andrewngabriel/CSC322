const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');
const Order = require('../models/order');
const Manager = require('../models/manager');
const Employee = require('../models/employee');
const mid = require('../middleware'); // Middleware helper functions for authentication

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
      date: new Date(),
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

router.get('/profile', mid.requiresLogin, (req, res, next) => {
  let accountType = req.session.accountType;
  if (accountType == 'Customer') {
    let orderHistory = Order.find({ customerId: req.session.userId });
    orderHistory.select(
      'ObjectId date customerAddress pizzaSize pizzaToppings pizzaRating deliveryRating customerRating'
    );
    orderHistory.exec((err, orders) => {
      if (err) {
        next(err);
      } else {
        Customer.findById(req.session.userId).exec((err, user) => {
          if (err) {
            next(err);
          } else {
            res.render('profile', {
              title: 'Profile',
              name: user.name,
              address: user.address,
              accountType: user.accountType,
              rating: user.rating,
              orderHistory: orders
            });
          }
        });
      }
    });
  } else if (accountType == 'Manager') {
    let orderHistory = Order.find();
    orderHistory.exec((err, orders) => {
      if (err) {
        next(err);
      } else {
        Manager.findById(req.session.userId).exec((err, manager) => {
          if (err) {
            next(err);
          } else {
            res.render('profile', {
              title: 'Profile',
              name: manager.name,
              accountType: manager.accountType,
              orderHistory: orders
            });
          }
        });
      }
    });
  } else if (accountType == 'Delivery') {
    let orderHistory = Order.find({ delivery: req.session.userId });
    orderHistory.select(
      'ObjectId date customerAddress pizzaSize pizzaToppings pizzaRating deliveryRating customerRating'
    );
    orderHistory.exec((err, orders) => {
      if (err) {
        next(err);
      } else {
        employee.findById(req.session.userId).exec((err, employee) => {
          if (err) {
            next(err);
          } else {
            res.render('profile', {
              title: 'Profile',
              name: employee.name,
              accountType: employee.accountType,
              orderHistory: orders
            });
          }
        });
      }
    });
  }
});

router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

router.post('/login', (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  let accountType = req.body.accountType;
  console.log(accountType);
  if (email && password && accountType) {
    if (accountType == 'Customer') {
      Customer.authenticate(email, password, accountType, (err, user) => {
        if (err || !user) {
          const err = new Error('Wrong email or password or account type');
          err.status = 401;
          next(err);
        } else {
          req.session.userId = user._id;
          req.session.address = user.address;
          req.session.accountType = user.accountType;
          res.redirect('/profile');
        }
      });
    } else if (accountType == 'Manager') {
      Manager.authenticate(email, password, (err, manager) => {
        if (err || !manager) {
          const err = new Error('Wrong email or password or account type');
          err.status = 401;
          next(err);
        } else {
          req.session.userId = manager._id;
          req.session.accountType = manager.accountType;
          res.redirect('/profile');
        }
      });
    } else if (accountType == 'Cook') {
      Employee.authenticate(email, password, accountType, (err, employee) => {
        if (err || !employee) {
          const err = new Error('Wrong email or password or account type');
          err.status = 401;
          next(err);
        } else {
          req.session.userId = employee._id;
          req.session.accountType = employee.accountType;
          res.redirect('/profile');
        }
      });
    } else if (accountType == 'Delivery') {
      Employee.authenticate(email, password, accountType, (err, employee) => {
        if (err || !employee) {
          const err = new Error('Wrong email or password or account type');
          err.status = 401;
          next(err);
        } else {
          req.session.userId = user._id;
          req.session.accountType = employee.accountType;
          res.redirect('/profile');
        }
      });
    }
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

  if (accountType == 'Customer') {
    if (email && name && address && password && accountType) {
      const userData = {
        email: email,
        name: name,
        address: address,
        password: password,
        accountType: accountType
      };

      if (accountType == 'Customer') {
        Customer.create(userData, (err, user) => {
          if (err) {
            next(err);
          } else {
            req.session.userId = user._id;
            req.session.address = user.address;
            req.session.accountType = user.accountType;
            res.redirect('/profile');
          }
        });
      }
    }
  } else if (accountType == 'Manager') {
    if (email && name && password) {
      const userData = {
        email: email,
        name: name,
        accountType: accountType,
        password: password
      };

      Manager.create(userData, (err, manager) => {
        if (err) {
          next(err);
        } else {
          req.session.userId = manager._id;
          req.session.accountType = manager.accountType;
          res.redirect('/profile');
        }
      });
    }
  } else if (accountType == 'Cook' || accountType == 'Delivery') {
    if (email && name && pasword) {
      const userData = {
        email: email,
        name: name,
        accountType: accountType,
        password: password
      };

      Employee.create(userData, (err, employee) => {
        if (err) {
          next(err);
        } else {
          req.session.userId = employee._id;
          req.session.accountType = employee.accountType;
          res.redirect('/profile');
        }
      });
    }
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

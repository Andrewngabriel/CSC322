const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');
const Order = require('../models/order');
const Manager = require('../models/manager');
const Delivery = require('../models/delivery');
const Cook = require('../models/cook');
const Employee = require('../models/employee');
const mid = require('../middleware'); // Middleware helper functions for authentication

router.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

// If user chooses visitor, then we create an instance of customer model with visitor accountType
router.post('/', (req, res, next) => {
  const userData = {
    email: `${Math.random()}@visitor.com`,
    name: 'Visitor',
    address: 'Visitor Address',
    password: 'visitor',
    accountType: 'visitor'
  };

  Customer.create(userData, (err, user) => {
    if (err) {
      next(err);
    } else {
      req.session.userId = user._id;
      req.session.address = user.address;
      req.session.accountType = user.accountType;
      res.redirect('./address');
    }
  });
  // res.render('address', { title: 'Address' });
});

router.get('/address', (req, res) => {
  res.render('address', { title: 'Address' });
});

router.get('/stores', (req, res) => {
  let storeList = Store.find();
  storeList.exec((err, stores) => {
    if (err) {
      next(err);
    } else {
      res.render('stores', { title: 'Stores', storeList: stores });
    }
  });
});

router.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

router.get('/order', (req, res) => {
  res.render('order', { title: 'About' });
});

router.post('/order', mid.requiresJoinStore, (req, res, next) => {
  let pizzaSize = req.body.pizzaSize;
  let toppings = req.body.toppings;

  if (pizzaSize && toppings) {
    const orderData = {
      date: new Date(),
      customerId: req.session.userId,
      customerAddress: req.session.address,
      store: req.session.store,
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
  if (accountType == 'customer' || accountType == 'visitor') {
    let orderHistory = Order.find({ customerId: req.session.userId });
    /*
    orderHistory.select(
      'ObjectId date customerAddress pizzaSize pizzaToppings pizzaRating deliveryRating customerRating'
    );
    */
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
  } else if (accountType == 'manager' || accountType == 'Manager') {
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
  } else if (accountType == 'delivery' || accountType == 'Delivery') {
    let orderHistory = Order.find({ delivery: req.session.userId });
    orderHistory.exec((err, orders) => {
      if (err) {
        next(err);
      } else {
        Delivery.findById(req.session.userId).exec((err, delivery) => {
          if (err) {
            next(err);
          } else {
            res.render('profile', {
              title: 'Profile',
              name: delivery.name,
              accountType: accountType,
              orderHistory: orders
            });
          }
        });
      }
    });
  } else if (accountType == 'cook' || accountType == 'Cook') {
    let orderHistory = Order.find({ cook: req.session.userId });
    orderHistory.exec((err, orders) => {
      if (err) {
        next(err);
      } else {
        Cook.findById(req.session.userId).exec((err, cook) => {
          if (err) {
            next(err);
          } else {
            res.render('profile', {
              title: 'Profile',
              name: cook.name,
              accountType: accountType,
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

  if (email && password && accountType) {
    if (accountType == 'customer') {
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
    } else if (accountType == 'manager') {
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
    } else if (accountType == 'cook') {
      Cook.authenticate(email, password, (err, cook) => {
        if (err || !cook) {
          const err = new Error('Wrong email or password or account type');
          err.status = 401;
          next(err);
        } else {
          req.session.userId = cook._id;
          req.session.accountType = accountType;
          res.redirect('/profile');
        }
      });
    } else if (accountType == 'delivery') {
      Delivery.authenticate(email, password, (err, delivery) => {
        if (err || !delivery) {
          const err = new Error('Wrong email or password or account type');
          err.status = 401;
          next(err);
        } else {
          req.session.userId = delivery._id;
          req.session.accountType = accountType;
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

  if (email && name && address && password && accountType) {
    if (accountType == 'customer') {
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
          req.session.address = user.address;
          req.session.accountType = user.accountType;
          res.redirect('/profile');
        }
      });
    } else if (accountType == 'manager') {
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
    } else if (accountType == 'cook') {
      const userData = {
        email: email,
        name: name,
        password: password
      };

      Cook.create(userData, (err, cook) => {
        if (err) {
          next(err);
        } else {
          req.session.userId = cook._id;
          req.session.accountType = accountType;
          res.redirect('/profile');
        }
      });
    } else if (accountType == 'delivery') {
      const userData = {
        email: email,
        name: name,
        password: password
      };

      Delivery.create(userData, (err, delivery) => {
        if (err) {
          next(err);
        } else {
          req.session.userId = delivery._id;
          req.session.accountType = accountType;
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

function loggedOut(req, res, next) {
  if (req.session.accountType == 'visitor') {
    req.session.destroy(err => {
      if (err) {
        next(err);
      } else {
        next();
      }
    });
  } else if (req.session && req.session.userId) {
    return res.redirect('/profile');
  } else {
    next();
  }
}

function requiresLogin(req, res, next) {
  if (req.session && req.session.userId) {
    next();
  } else {
    const err = new Error('You must be logged in to view this page.');
    err.status = 401;
    next(err);
  }
}

function requiresJoinStore(req, res, next) {
  if (req.session && req.session.storeJoinedId) {
    next();
  } else {
    const err = new Error('You must join a store before being able to order.');
    err.status = 401;
    next(err);
  }
}

function requiresManagerAccess(req, res, next) {
  if (
    req.session.accountType == 'manager' ||
    req.session.accountType == 'Manager'
  ) {
    next();
  } else {
    const err = new Error('Only Managers can access this page');
    err.status = 401;
    next(err);
  }
}

function requiresCustomerAccess(req, res, next) {
  let accountType = req.session.accountType;
  if (accountType == 'customer' || accountType == 'Customer') {
    next();
  } else {
    const err = new Error('Only Customers can access this page');
    err.status = 401;
    next(err);
  }
}

function genRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

module.exports.loggedOut = loggedOut;
module.exports.requiresLogin = requiresLogin;
module.exports.requiresJoinStore = requiresJoinStore;
module.exports.genRandomNum = genRandomNum;
module.exports.requiresManagerAccess = requiresManagerAccess;
module.exports.requiresCustomerAccess = requiresCustomerAccess;

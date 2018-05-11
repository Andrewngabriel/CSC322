function loggedOut(req, res, next) {
  if (req.session && req.session.userId) {
    return res.redirect('/profile');
  }
  next();
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
  if (req.session && req.session.store) {
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

function genRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

module.exports.loggedOut = loggedOut;
module.exports.requiresLogin = requiresLogin;
module.exports.requiresJoinStore = requiresJoinStore;
module.exports.genRandomNum = genRandomNum;
module.exports.requiresManagerAccess = requiresManagerAccess;

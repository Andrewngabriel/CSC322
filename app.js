const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const app = express();
const PORT = 3000;

// mongodb connection
mongoose.connect('mongodb://localhost:27017/aamm');
let db = mongoose.connection;

// mongo error
db.on('error', console.error.bind(console, 'Connection error'));

// use sessions for tracking logins
app.use(
  session({
    secret: 'aamm',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db
    })
  })
);

// make userId available in templates
app.use((req, res, next) => {
  res.locals.currentUser = req.session.userId;
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Configure express to use pug as the templating engine and using /static for rendering css,js files
app.use('/static', express.static('public'));
app.set('view engine', 'pug');

const mainRoutes = require('./routes/index');
app.use('/', mainRoutes);

app.listen(PORT, () => {
  console.log(`Up and running on: ${PORT}`);
});

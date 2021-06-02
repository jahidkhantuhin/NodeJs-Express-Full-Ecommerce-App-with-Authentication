const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/user');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');



const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin')
const authRoutes = require('./routes/auth')

const MONGODB_URI =
// Put your Mongodb Api Below.
  '';

const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now()+ file.originalname)
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection);
app.use(flash());


app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)


app.use((req, res, next) => {
    console.log('My first testing')
    res.status(404).render('404', {
        pageTitle: 'Page Not Found',
        path: '',
        isAuthenticated: req.session.isLoggedIn
    } )
});


mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(9000);
  })
  .catch(err => {
    console.log(err);
  });

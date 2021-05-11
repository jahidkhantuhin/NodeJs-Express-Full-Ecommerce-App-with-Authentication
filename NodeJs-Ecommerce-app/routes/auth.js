const express = require('express');
const { check, body } = require('express-validator/check');

const authControllers = require('../controllers/auth');
const User = require('../models/user');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/login', authControllers.getLogin);

router.post('/login',
[
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address.'),
  body('password', 'Password has to be valid.')
    .isLength({ min: 5 })
    .isAlphanumeric()
], authControllers.postLogin);

router.post('/logout', isAuth, authControllers.postLogout);

router.get('/signup', authControllers.getSignup);

router.post('/signup', 
    [
      check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        // if (value === 'test@test.com') {
        //   throw new Error('This email address if forbidden.');
        // }
        // return true;
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject(
              'E-Mail exists already, please pick a different one.'
            );
          }
        });
      }),
    body(
      'password',
      'Please enter a password with only numbers and text and at least 5 characters.'
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords have to match!');
      }
      return true;
    })
    ], authControllers.postSignup);

module.exports = router;
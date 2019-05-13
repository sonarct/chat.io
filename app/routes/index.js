const express = require('express');

const router = express.Router();
const passport = require('passport');

const User = require('../models/user');
const Room = require('../models/room');
const Message = require('../models/message');

// Home page
router.get('/', function(req, res, next) {
  // If user is already logged in, then redirect to rooms page
  if (req.isAuthenticated()) {
    res.redirect('/rooms');
  } else {
    res.render('login', {
      success: req.flash('success')[0],
      errors: req.flash('error'),
    });
  }
});

router.get('/login', (req, res, next) => {
  res.render('login', {
    success: req.flash('success')[0],
    errors: req.flash('error'),
  });
});

router.get('/register', (req, res, next) => {
  res.render('register', {
    success: req.flash('success')[0],
    errors: req.flash('error'),
  });
});

// Login
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/rooms',
    failureRedirect: '/',
    failureFlash: true,
  }),
);

// Register via username and password
router.post('/register', function(req, res, next) {
  const credentials = {
    username: req.body.username,
    password: req.body.password,
  };

  if (credentials.username === '' || credentials.password === '') {
    req.flash('error', 'Missing credentials');
    req.flash('showRegisterForm', true);
    res.redirect('/');
  } else {
    // Check if the username already exists for non-social account
    User.findOne(
      {
        username: new RegExp(`^${req.body.username}$`, 'i'),
        socialId: null,
      },
      function(err, user) {
        if (err) throw err;
        if (user) {
          req.flash('error', 'Username already exists.');
          req.flash('showRegisterForm', true);
          res.redirect('/');
        } else {
          User.create(credentials, function(err, newUser) {
            if (err) throw err;
            req.flash(
              'success',
              'Your account has been created. Please log in.',
            );
            res.redirect('/');
          });
        }
      },
    );
  }
});

// Rooms
router.get('/rooms', [
  User.isAuthenticated,
  function(req, res, next) {
    Room.find(function(err, rooms) {
      if (err) throw err;

      res.render('rooms', { rooms });
    });
  },
]);

// Chat Room
router.get('/chat/:id', [
  User.isAuthenticated,
  function(req, res, next) {
    const roomId = req.params.id;

    Room.findById(roomId, function(err, room) {
      if (err) throw err;

      if (!room) {
        return next();
      }

      const params = {
        room: roomId,
      };

      Message.find(params, function(err, messages) {
        res.render('chatroom', { user: req.user, room, messages });
      });
    });
  },
]);

// Logout
router.get('/logout', function(req, res, next) {
  // remove the req.user property and clear the login session
  req.logout();

  // destroy session data
  req.session = null;

  // redirect to homepage
  res.redirect('/');
});

module.exports = router;

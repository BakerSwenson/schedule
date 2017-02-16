var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');

// Models
var User = require('../models/users.js');
var Pass = require('../models/schedules.js');

router.get('/', ensureAuthenticated, inUser, function(req, res) {
  res.send(`
<ul>
<li><a href="/schedule">Schedule</a></li>
<li><a href="/class">Class</a></li>
<li><a href="/admin">Admin</a></li>
<li><a href="/absents">Absents</a></li>
</ul>
`);
});

router.get('/login', function(req, res) {
  res.redirect('/auth/google');
});

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
router.get('/auth/google',
  passport.authenticate('google', { hd: 'winona.k12.mn.us', scope: ['openid email profile']}));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    // Authenticated success
    res.redirect('/');
  });

router.get('/ajax/user', function(req, res){
  var data = req.inUser;
  res.json({data});
})

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


function inUser(req, res, next) {
	User.findById(req.user._id, function(err, user) {
		req.inUser = user;
		return next();
	})
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;

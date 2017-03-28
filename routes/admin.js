var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Models
var User = require('../models/users');

router.get('*', ensureAdmin);

//admin stuff
router.get('/', function(req, res) {
	User.find({}, function(err, users) {
		if(err){
			console.log(err);
		}else{
			res.render('admin/users', {
				users: users
			});
		}
	});
});
//user / etc search
router.post('/users', function(req, res) {
	var searchText = req.body.name;
	User.find({'$or':[{email:new RegExp(searchText,'i')},{last: new RegExp(searchText, 'i')}]}).exec(function(err, users) {
		res.render('admin/users', {
			users: users
		})
	});
});
//update user
router.put('/users/:userID', function(req, res) {
	var first = req.body.first;
	var last = req.body.last;
	var isteacher = req.body.isteacher;
	var isadmin = req.body.isadmin;
	var isview_absents = req.body.isview_absents
	User.findById(req.params.userID, function (err, user) {
		user.update({
			name: {
				first : first,
				last : last,
			},
			permissions :{
				teacher: isteacher,
				admin: isadmin,
				view_absents: isview_absents
			}
		}, function (err, userID) {
			res.redirect('/admin/user/'+req.params.userID);
		}) 
	});
});


//router sort
router.get('/sort/teacher', function(req, res) {
	User.find({"permissions.teacher": true}, function(err, users) {
		res.render('admin/users', {
			users: users
		})
	})
});
router.get('/sort/admin', function(req, res) {
	User.find({"permissions.admin": true}, function(err, users) {
		res.render('admin/users', {
			users: users
		})
	})
});
router.get('/errors/search', function(req, res) {
	res.redirect('/admin/errors/list');
});
router.get('/errors/resolve/:passID', function(req, res) {
	Pass.update({ _id: req.params.passID }, { $set: { error: { toggle: false } }}, function(err, works){
		console.log(works + ' error resolved!');
		res.redirect('/admin');
	});
});
router.get('/user/:id', function(req, res) {
	User.findById(req.params.id, function(err, user) {
		if (err){
			console.log(err);
		}else{
			console.log('here');
			console.log(req.params.id);
			res.render('admin/user', {
				user: user
			});
		}
	});
});

//Simple route middleware to ensure admin.
function ensureAdmin(req, res, next) {
	if(req.isAuthenticated()) {
		User.findById( req.user._id, function(err, user) {
			console.log(user);
			if( user.permissions.admin === true){
				return next();
			}else{
				// res.redirect('/account');
				res.end("You are not an admin");
			}
		})
	}else{
		res.redirect('/auth/google');
	}
}
module.exports = router;

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// Models
var User = require('../models/users.js');
var Class = require('../models/classes.js');
var Schedule = require('../models/schedules.js');
var Log = require('../models/logs.js');

router.get('/', function(req, res){
	res.render('absents/index')
});
//search?type=1&start=5&finish=11&teacher=5896161c9a8cd60f60b3e6a5
router.get('/ajax/search',function(req, res) {
	if(req.query.type){

	}else if(req.query.type === 0){

	}else if(req.query.type === 1){

	}else if(req.query.type === 2){
		
	}else if(req.query.type === 3){
		
	}else{
		res.send('Error: Invaild Search');
	}
});

module.exports = router;
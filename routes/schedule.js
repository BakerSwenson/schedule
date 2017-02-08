var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// Models
var User = require('../models/users.js');
var Class = require('../models/classes.js');
var Schedule = require('../models/schedules.js')

router.get('/*', ensureAuthenticated)

router.get('/', function(req, res){
	res.render('schedule/index', {
		user: {
			name: {
				first: req.user.name.first,
				last: req.user.name.last
			}
		}
	});
})

router.get('/ajax/search/:query', function(req, res) {
	Class.find({class_name: new RegExp(req.params.query,'i'), day: req.query.day, hour: req.query.hour, open: true} ).exec(function(err, classes) {
		res.json(classes);
	})
})

router.get('/ajax/add/:class_id', function(req, res){
	Class.findById(req.params.class_id, function(err, class1){
		getSchedule(req.user._id, function(err, schedule){
			var options = {
		      path: 'Wednesday.GSH.class',
		      model: 'Class'
		    };
		    var curr = new Date;
			var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
			var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay()+6)); 
			console.log(class1.week.next);

		    if(class1.week.next == true){
		    	console.log('Dates do not work D:');
		    	res.json({msg: 'Class opens next week!', color: 'e74c3c'});
			}else{
				console.log('Dates check out here');
				Schedule.populate(schedule, options, function (err, schedule1) {
					if(schedule1.Wednesday.GSH.class != undefined){
				    	if(schedule1.Wednesday.GSH.class != null){
				    		console.log('No Good');
				    		res.json({msg: 'You already have a class!', color: 'e74c3c'});
				    	}else if(schedule1.Wednesday.GSH.class.teacher_add == true){
				    		console.log("No Good 2.0");
				    		res.json({msg: 'You already have a class!', color: 'e74c3c'});
				    	}else{
				    		var day = class1.day;
							var hour = class1.hour;
							var path = `${day}.${hour}`;
							console.log(path);
							var json = { class: class1._id, teacher_add: false, default: false, pending: true };
				    		Schedule.findByIdAndUpdate(schedule1._id, {$set: { [path]: json}}, function(err, doc) {
				    		});
				    		res.json({msg: 'Pending request sent!', color: '3498db'});
				    	}
				    }else{
				    	var day = class1.day;
						var hour = class1.hour;
						var path = `${day}.${hour}`;
						console.log(path);
						var json = { class: class1._id, teacher_add: false, default: false, pending: true };
				    	Schedule.findByIdAndUpdate(schedule1._id, {$set: { [path]: json}}, function(err, doc) {
				    	});
				    	res.json({msg: 'Pending request sent!', color: '3498db'});
				    }
			    });
			}
		})
	});
});

router.get('/ajax/schedule', function(req, res){
	getSchedule(req.user._id, function(err, schedule){
		if(err){
			console.log("Error with schedule!");
		}else{
			var options = {
		      path: 'Wednesday.GSH.class',
		      model: 'Class'
		    };
			Schedule.populate(schedule, options, function (err, schedule1) {
		      res.json(schedule1);
		    });
		}
	});
	/*
	CreateSchedule(req.user._id, function(user) {

		if(user){
			var curr = new Date;
			var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
			var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay()+6));
			Schedule.findById(user.curr_schedule, function(err, schedule) {
				console.log(schedule.week.start.getDate());
				console.log(firstday.getDate())
				if(schedule.week.start.getDate() == firstday.getDate() || schedule.week.finish.getDate() == lastday.getDate()){
					console.log("current sched good!");
				}
			})
		}else{
			console.log('death to you');
		}
	});
	*/
});


//make and check if schedule exists <- also check the times with current
//callback (err(boolean), schedule)
function getSchedule(user, callback){
	User.findById(user, function(err, user){
		Schedule.findOne({ creator: user._id, completed: false}, function(err, schedule){
			console.log(schedule);
			if(schedule == null){
				schedule = "";
				console.log("schedule ="+schedule);
			}
			if(schedule){
				if(user.curr_schedule.toString() == schedule._id.toString()){
					var curr = new Date;
					var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
					var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay()+6));
					if( schedule.week.start.getDate() == firstday.getDate() && schedule.week.finish.getDate() == lastday.getDate() ){
						console.log('Week\'s checks out');
						callback(false, schedule);
					}else{
						console.log('Week doesn\'t check out, and time to retire');
						User.findOneAndUpdate({ _id: user._id }, { $set: {curr_schedule: undefined}}, function(err, works){
							console.log('User nexted');
						});
						Schedule.findOneAndUpdate({ _id: schedule._id }, { $set: {completed: true}}, function(err, works){
							console.log('Scheduel nexted');
						});
						user.past_schedules.push(schedule._id);
						user.save();
						getSchedule(user._id, function(err, schedule){
							if(schedule){
								callback(false, schedule);
							}else{
								callback(true);
							}
						});
					}
					
				}else{
					//JSKDFL:DJSKL:BJL:KJ:LKSDFGLJ:IEJWKLIOVJN:DKLSJFLKWE:GJ:JNB:IJSKDLJFIOWEL:MBK:J:
				}
			}else{
				User.findOneAndUpdate({ _id: user._id }, { $set: {curr_schedule: undefined}}, function(err, works){
					console.log('Fixed because nothing works.');
					console.log("no pass found1" + user.curr_schedule);
				});

				var curr = new Date();
				var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
				var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay()+6));
				function findDefault(hour, day, callback)  {
				    Class.findOne({hour: hour, day: day, default_students : { "$in" : [user._id]}}, function(err, class1) {
				        if(class1){
				        	callback(class1._id, true);
				        }else{
				        	callback(null, false)
				        }
				    });
				}
				findDefault("GSH", "Monday", function (resultm, m) {
				    findDefault("GSH", "Tuesday", function (resulttu, tu) {
					    findDefault("GSH", "Wednesday", function (resultw, w) {
						    findDefault("GSH", "Thursday", function (resultth, th) {
							    findDefault("GSH", "Friday", function (resultfr, fr) {
								    newSchedule = new Schedule({
										week: {
											start: firstday,
											finish: lastday
										},
										creator: user._id,
										monday: {
											GSH: {
												class: resultm,
												teacher_add: false,
												default: m
											}
										},
										tuesday: {
											GSH: {
												class: resulttu,
												teacher_add: false,
												default: tu
											}
										},
										wednesday: {
											GSH: {
												class: resultw,
												teacher_add: false,
												default: w
											}
										},
										thursday: {
											GSH: {
												class: resultth,
												teacher_add: false,
												default: th
											}
										},
										friday: {
											GSH: {
												class: resultfr,
												teacher_add: false,
												default: fr
											}
										},
										completed: false
									})
									console.log(newSchedule);
									User.findOneAndUpdate({ _id: user._id }, { $set: {curr_schedule: newSchedule._id}}, function(err, works){
										console.log('user curr_schedule set to ' + newSchedule._id);
									});
									newSchedule.save(function(err, schedule) {
										callback(false, schedule);
									});
								});
							});
						});
					});
				});
			}
		});
	});
}
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
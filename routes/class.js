var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// Models
var User = require('../models/users.js');
var Class = require('../models/classes.js');
var Schedule = require('../models/schedules.js');
var Log = require('../models/logs.js');

router.use('/*', ensureAuthenticated, inUser, ensureTeacher)

//Get List of requesting for class
router.get('/ajax/approveable/:classID', function(req, res) {
	Class.findById(req.params.classID, function(err, class1){
		console.log(req.params.classID);
		var path = "Wednesday.GSH.class";
		var pathp = "Wednesday.GSH.pending"
		Schedule.find({[path]: class1._id, [pathp]: true}, function(err, schedules){
			var options = {
				path: 'creator',
				model: 'User'
			};
			Schedule.populate(schedules, options, function (err, test) {
				res.json(test);
			});
		})
	})
});


router.get('/ajax/open/:classID', function(req, res) {
	Class.findById(req.params.classID, function(err, class1){
		console.log(req.query.next);
		var students = class1.students;
		var default_students = class1.default_students;
		class1.students = default_students;
		class1.save(function(err, d){
			console.log('Class Pushed default');
			console.log(d);
		});
		console.log( students );
		Class.findByIdAndUpdate(req.params.classID, {$set: { open: true}}, function(err, doc) {
			var options = {
				path: 'students',
				model: 'User'
			};
			Class.populate(class1, options, function (err, class1) {
				var students1 = class1.students;
				students1.forEach(function(student){
					User.findById(student, function(err, user){
						var day = class1.day;
						var hour = class1.hour;
						var path = `${day}.${hour}`;
						var pathp = `${day}.${hour}.pending`;
						console.log(path);
						var json = { class: class1._id, teacher_add: false, default: true, pending: false };
						Schedule.update({_id: user.curr_schedule}, {$set: { [path]: json}}, function(err, doc) {
						});

					});
				});
			});
			console.log(doc.class_name +" - Opened for business");
			res.send('good');
		});
	})
});

//Get class 
router.get('/ajax/class/:classid', function(req, res) {

	Class.findById(req.params.classid, function(err, class1){
		var options = {
			path: 'students',
			model: 'User'
		};
		Schedule.populate(class1, options, function (err, class2) {
			res.json(class2);
		});
	});
});

//Get class 
router.get('/ajax/log/:id', function(req, res) {
	Log.findById( req.params.id, function(err, log){
		res.json(log);
	})
});


//only class
router.get('/ajax/only/class/:id', function(req, res) {
	Class.findById(req.params.id, function(err, class1){
		res.json(class1);
	});
})

//Removes student from class!
router.get('/ajax/remove/:classid/:studentid', function(req, res, next) {
	checkIDs(req.params.studentid, req.params.classid, function(checks, class1, user) {
		if(checks){
			if(req.query.default_student){
				if(class1.open){
				}else{
					Class.update( 
						{ _id: class1._id},
						{ $pull: { default_students : user._id } },
						{ safe: true },
						function(err, class5) {
							console.log(class5);
						});
				}
			}else{
				Class.update( 
					{ _id: class1._id},
					{ $pull: { students : user._id } },
					{ safe: true },
					function(err, class5) {
						console.log(class5);
					});
			}
			var day = class1.day;
			var hour = class1.hour;
			var path = `${day}.${hour}`;
			var json = { class: null, teacher_add: false, default: false, pending: false };
			getSchedule(user._id, function(err, schedule) {
				Schedule.findByIdAndUpdate(schedule._id, {$set: { [path]: json}}, function(err, doc) {
					res.send('SUCCESSFULLY DONE');
				});
			})
		}else{
			
		}
	})
})

router.get('/', function(req, res) {
	console.log(req.user);
	Class.find({teachers: req.user._id}, function(err, classes) {
		console.log(classes.length);
		if(classes.length == 1){
			console.log(classes);
			res.redirect('/class/'+classes[0]._id);
		}else if(classes.length > 1 || classes.length == 0){
			res.redirect('/class/choose');
		}else{
			res.redirect('/')
		}
	});
});


router.get('/create', function(req, res) {
	res.render('class/create');
});

router.post('/change_name', function(req, res) {
	Class.findByIdAndUpdate(
		req.body.classID,
		{$set: { class_name: req.body.class_name }},
		function (err, val) {
			res.redirect("/class/" + req.body.classID);
		}
	);
});

router.get('/choose', function(req, res) {
	Class.find({teachers: [req.user._id]}, function(err, classes) {
		if (err){
			res.json(err)
		}else{
			console.log(classes);
			res.render('class/selectClass', {
				classes: classes
			});
		}
	});
});

router.post('/create', function(req, res) {
	var curr = new Date;
	var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
	var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay()+6));
	var class_name = req.body.class_name;
	var limit = req.body.limit;
	var hour = req.body.hour;
	var day = req.body.day;

	newClass = new Class({
		class_name: class_name,
		limit: limit,
		hour: hour,
		day: day,
		week: {
			start: firstday,
			finish: lastday,
			next: false,
			next_start: null,
			next_finish: null
		},
		open: false,
		teachers: req.user._id
	})
	newClass.save(function(err, class1) {
		if(err) {
			console.log(err);
		} else {
			console.log(class1);
			res.redirect('/class/'+class1._id);
		}
	});
})

router.get('/:id', function(req, res, next) {
	Class.findById(req.params.id, function(err, class1) {
		if(err || class1 == null){
			console.log("Error with fetching for class");
			res.redirect('/class');
			next();
		}else{

			//search by curr_schedule for user and get names and schedule id!
			getClass(class1._id, function(class1){
				console.log(class1);
			});
			console.log(class1);
			res.render('class/index', {
				class1: class1
			});
		}
	});
});

router.get('/:id/attendance', function(req, res) {
	res.render('class/attendance');
});

router.get('/ajax/add/:classid/:studentid', function(req, res) {
	checkIDs(req.params.studentid, req.params.classid, function(checks, class1, user) {
		if(checks){
			getSchedule(user._id, function(err, schedule) {
				var day = class1.day;
				var hour = class1.hour;
				var path = `${day}.${hour}`;
				console.log(path);
				var json = { class: class1._id, teacher_add: true, default: false, pending: false };
				console.log(schedule)
				console.log("for schedule bro: " + schedule._id);
				Schedule.findByIdAndUpdate(schedule._id, {$set: { [path]: json}}, function(err, doc) {
					Class.findOne({hour: class1.hour, day: class1.day, students : { "$in" : [user._id]}} , function(err, class2) {
						if(class2){
							console.log('Class already has added.');
							res.send('');
						}else{
							res.send('');
							class1.students.push(user._id);
							class1.save(function(err){
								console.log('Added Student to class!');
							});
						}
					});
				});
			});

		}else{
			console.log("bad");
			res.send("bad");
		}
	})
})

router.get('/ajax/add-default-student/:classid/:studentid', function(req, res) {
	checkIDs(req.params.studentid, req.params.classid, function(checks, class1, user) {
		if(checks){
			if(class1.open){
				console.log('Class is open and you cannot add now');
				res.send('');
			}else{
				var hour = class1.hour;
				var day = class1.day;
				Class.findOne({hour: hour, day: day, default_students : { "$in" : [user._id]}} , function(err, class2) {
					if(class2){
						console.log('Class already has this user');
						res.send('');
					}else{
						Class.find({})
						res.send('');
						class1.default_students.push(user._id);
						class1.save(function(err){
							console.log('Save a new default student.');
						})
					}
				})
			}
		}else{
			console.log("bad");
		}
	})
})
router.get('/ajax/add-teacher/:classid/:userid', function(req, res) {
	User.findById(req.params.userid, function(err, user) {
		if(err){
			res.send('ERROR: User not found!');
		}else{
			Class.findById(req.params.classid, function(err, class1){
				Class.findOne({_id: req.params.classid, teachers : { "$in" : [req.params.userid]}} , function(err, class2) {
					if(class2){
						console.log('Class already has this user');
						res.send('');
					}else{
						Class.find({})
						res.send('');
						class1.teachers.push(req.params.userid);
						class1.save(function(err){
							console.log('Save a new teacher to class');
						})
					}
				})
			});
		}
	})
})

router.post('/:classID/attendance', function(req, res) {
	Class.findById(req.params.classID, function(err, class1){
		var options = {
			path: 'students',
			model: 'User'
		};
		Schedule.populate(class1, options, function (err, class2) {
			var sd = class2.week.start;
			var ed = class2.week.finish;
			var newLog = new Log({
				week: {
					start: sd,
					finish: ed
				},
				classID: class1._id,
				className: class1.class_name,
				teachers: [class1.teachers],
				students: []
			});
			console.log(newLog);
			var students = class2.students;
			var studentsOfLog = newLog.students;
			students.forEach(function(student){
				studentsOfLog.push({name: student.fullname, _id: student._id, status: req.body[student._id]})
			});
			var saveable = new Log(newLog); // WORKS BUT TEMP MAYBE???/
			saveable.save(function(err, doc){
				console.log(doc +" - Saved Class Logged or something")
			});
			var curr = new Date;
			var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
			var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay()+6)); 
			var options = {
				path: 'students',
				model: 'User'
			};
			Class.populate(class1, options, function (err, class1) {
				var students1 = class1.students;
				students1.forEach(function(student){
					Class.findOne({hour: class1.hour, day: class1.day, default_students : { "$in" : [student._id]}}, function(err, class2) {
						if(class2){
							var day = class1.day;
							var hour = class1.hour;
							var path = `${day}.${hour}`;
							console.log(path);
							var json = { class: class2._id, teacher_add: false, default: true, pending: false };
							Schedule.update({_id: student.curr_schedule}, {$set: { [path]: json}}, function(err, doc) {
								console.log('Indavidual');
							});
						}else{
							var day = class1.day;
							var hour = class1.hour;
							var path = `${day}.${hour}`;
							console.log(path);
							var json = { class: null, teacher_add: false, default: false, pending: false };
							Schedule.update({_id: student.curr_schedule}, {$set: { [path]: json}}, function(err, doc) {
								console.log('');
							});
						}
					});
				});
			});
		});
		var path = "Wednesday.GSH.class";
		var pathj = "Wednesday.GSH";
		var pathp = "Wednesday.GSH.pending";
		var json = { class: null, teacher_add: false, default: false, pending: false };
		Schedule.update({[path]:class1._id, [pathp]: true}, {$set: { [pathj]: json}}, function(err, doc) {
			console.log('PENDING STUDENTS REMOVED');
		});
		Class.findByIdAndUpdate(class1._id, {$set: { students: [], open: false, "week.next": false}}, function(err, doc) {
			console.log('IT WAS SUCCESSFULLY UPDATED');
			res.redirect('/class/'+doc._id);
		});

	})
	/*
	 newlog = new Log({
	 Users: {
	 k
	 }
	 })
	 */
});
router.get('/ajax/:id/past-classes', function(req, res) {
	Log.find({classID: req.params.id}, function(err, logs){
		res.send(logs);

	})
}) 
router.post('/ajax/search', function(req, res, next) {
	var path = "permissions.teacher";

	User.find({fullname: new RegExp(req.body.query,'i'), [path]: false} ).exec(function(err, users) {
		res.json(users);
	})
});
router.post('/ajax/search/t', function(req, res, next) {
	var path = "permissions.teacher";

	User.find({fullname: new RegExp(req.body.query,'i'), [path]: true} ).exec(function(err, users) {
		res.json(users);
	})
});

function checkIDs(studentID, classID, callback) {
	var checks = null;
	Class.findById(classID, function(err, class1) {
		if(err){
			var checks = false;
			callback(checks);
		}else{
			User.findById(studentID, function(err, user) {
				if(err){
					var checks = false;
					callback(checks);
				}else{
					var checks = true;
					callback(checks, class1, user);
				}
			})
		}
	})
}



function getClass(classid, callback){
	Class.findById(classid, function(err, class1){
		if(err){
			res.send('Error with class!');
		}
		var curr = new Date;
		var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
		var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay()+6)); 
		console.log(firstday.getDate() +" - "+ class1.week.start.getDate() +"  ||  "+ lastday.getDate() +" - "+ class1.week.finish.getDate())
		console.log('div');
		
		if(class1.week.next == false && firstday.getDate() == class1.week.start.getDate() && lastday.getDate() == class1.week.finish.getDate()){
			console.log('[Class] Works out');
			callback(class1);
		}else{
			var options = {
				path: 'students',
				model: 'User'
			};
			Class.populate(class1, options, function (err, class1) {
				var students = class1.students;
				students.forEach(function(student){
					User.findById(student, function(err, user){
						var day = class1.day;
						var hour = class1.hour;
						var path = `${day}.${hour}`;
						var pathp = `${day}.${hour}.pending`;
						console.log(path);
						var json = { class: null, teacher_add: false, default: false, pending: false };
						Schedule.update({_id: user.curr_schedule, [pathp]: true}, {$set: { [path]: json}}, function(err, doc) {
							
						});
					});
				});
				var path = "Wednesday.GSH.class";
				var pathj = "Wednesday.GSH";
				var pathp = "Wednesday.GSH.pending";
				var json = { class: null, teacher_add: false, default: false, pending: false };
				Schedule.update({[path]:class1._id, [pathp]: true}, {$set: { [pathj]: json}}, function(err, doc) {
					console.log('PENDING STUDENTS REMOVED');
				});
				Class.findByIdAndUpdate(class1._id, {$set: { students: [], open: false, "week.start": [firstday], "week.finish": [lastday]}}, function(err, doc) {
					console.log('IT WAS SUCCESSFULLY UPDATED');
					callback(class1._id);
				});
			});
		}
	})
}

//make and check if schedule exists <- also check the times with current
//callback (err(boolean), schedule)
function getSchedule(user, callback){
	User.findById(user, function(err, user){
		console.log("HEre 1");
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
				console.log("no pass found1" + user.curr_schedule);

				var curr = new Date();
				var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
				var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay()+6));
				function findDefault(hour, day, callback)  {
					Class.findOne({hour: hour, day: day, default_students : { "$in" : [user._id]}}, function(err, class1) {
						if(class1){
							console.log("FOUND A DEFAULT CLASS");
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
										callback(false, schedule, true);
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

function ensureTeacher(req, res, next) {
	if (req.inUser.permissions.teacher) {
		next();
	} else {
		res.end("You are not a teacher");
	}
}

module.exports = router;

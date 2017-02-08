var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var logSchema = Schema({
	classID: { type: Schema.Types.ObjectId, ref: 'Class' },
	className: String,
	teachers: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
	students: [{
    	name: String,
    	_id: { type: Schema.Types.ObjectId, ref: 'User' },
    	status: String
    }],
    week: {
    	start: Date,
    	finish: Date
    }
});
module.exports = mongoose.model('Log', logSchema, 'Log');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var classSchema = Schema({
	class_name: String,
	hour: String,
	day: String,
	limit: Number,
	open: Boolean,
	week: {
		start: Date,
		finish: Date,
		next: Boolean,
		next_start: Date,
		next_finish: Date
	},
	teachers: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
	default_students: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
	students: [{ type: Schema.Types.ObjectId, ref: 'Users'}]
});
module.exports = mongoose.model('Class', classSchema, 'Class');

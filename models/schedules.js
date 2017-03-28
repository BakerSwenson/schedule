var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var scheduleSchema = Schema({
	week: {
		start: Date,
		finish: Date
	},
	creator: { type: Schema.Types.ObjectId, ref: 'User' },
	scheduleTEMP: { type: Schema.Types.ObjectId, ref: 'ScheduleTEMP' },
	Monday:{
		GSH: {
			start: String,
			end: String,
			class: { type: Schema.Types.ObjectId, ref: 'Class' },
			teacher_add: { type: Boolean, default: false},
			default: { type: Boolean, default: false},
			pending: { type: Boolean, default: false}
		}
	},
	Tuesday:{
		GSH: {
			start: String,
			end: String,
			class: { type: Schema.Types.ObjectId, ref: 'Class' },
			teacher_add: { type: Boolean, default: false},
			default: { type: Boolean, default: false},
			pending: { type: Boolean, default: false}
		}
	},
	Wednesday:{
		GSH: {
			start: String,
			end: String,
			class: { type: Schema.Types.ObjectId, ref: 'Class' },
			teacher_add: { type: Boolean, default: false},
			default: { type: Boolean, default: false},
			pending: { type: Boolean, default: false}
		}
	},
	Thursday:{
		GSH: {
			start: String,
			end: String,
			class: { type: Schema.Types.ObjectId, ref: 'Class' },
			teacher_add: { type: Boolean, default: false},
			default: { type: Boolean, default: false},
			pending: { type: Boolean, default: false}
		}
	},
	Friday:{
		GSH: {
			start: String,
			end: String,
			class: { type: Schema.Types.ObjectId, ref: 'Class' },
			teacher_add: { type: Boolean, default: false},
			default: { type: Boolean, default: false},
			pending: { type: Boolean, default: false}
		}
	},
	error: {
		toggle: Boolean,
		reason: String,
		created_at: Date
	},
	completed: Boolean
});
module.exports = mongoose.model('Schedule', scheduleSchema, 'Schedule');

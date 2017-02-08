var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = Schema({
	google_id: Number,
	email: String,
    fullname: String,
	name: {
        first: String,
        last: String,
        honorific: String
    },
    open: {
        toggle: Boolean,
        start: Number,
        end: Number
    },
    past_schedules: [{ type: Schema.Types.ObjectId, ref: 'Schedule' }],
    curr_schedule: { type: Schema.Types.ObjectId, ref: 'Schedule'},
   	joined: { type: Date, default: Date.now },
    permissions: {
        teacher: Boolean,
        admin: Boolean,
        view_absents: Boolean 
    }
});
module.exports = mongoose.model('User', userSchema, 'User');
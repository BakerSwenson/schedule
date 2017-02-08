var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var scheduleTEMPSchema = Schema({
	name: String,
	creator: { type: Schema.Types.ObjectId, ref: 'User' },
	active: Boolean,
	monday:{
		GSH: {
			start: String,
			end: String,
			available: Boolean
		}
	},
	tuesday:{
		GSH: {
			start: String,
			end: String,
			available: Boolean
		}
	},
	wednesday:{
		GSH: {
			start: String,
			end: String,
			available: Boolean
		}
	},
	thursday:{
		GSH: {
			start: String,
			end: String,
			available: Boolean
		}
	},
	friday:{
		GSH: {
			start: String,
			end: String,
			available: Boolean
		}
	}
});
module.exports = mongoose.model('ScheduleTEMP', scheduleTEMPSchema, 'ScheduleTEMP');
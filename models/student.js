var mongoose = require('mongoose'), Schema = mongoose.Schema

var studentSchema = new Schema({
	created: Number, 
	domain: String, 
	username: String, 
	email:  String, 
	planOfStudy_forms: [{type: Schema.Types.ObjectId, ref: 'PlanOfStudy'}] 
});

var Student = mongoose.model('Student', studentSchema);

module.exports = Student;
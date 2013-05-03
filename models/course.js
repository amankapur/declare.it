var mongoose = require('mongoose'), Schema = mongoose.Schema

var courseSchema = new Schema({
	section: String, 
	name: String, 
	credit: Number, 
	grade: String, 
	type: String, 
	number: String, 
	id: String
});

var Course = mongoose.model('Course', courseSchema);

module.exports = Course;
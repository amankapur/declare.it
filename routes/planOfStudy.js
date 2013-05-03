var Student = require('../models/student')
var Course = require('../models/course')
var PlanOfStudy = require('../models/planOfStudy')


exports.displayForm = function(req, res){
	res.render('planOfStudyForm', {title: "Engineering Plan of Study"});
}

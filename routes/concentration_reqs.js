var Student = require('../models/student')
var Course = require('../models/course')
var PlanOfStudy = require('../models/planOfStudy')


exports.displayReqs = function(req, res){
	res.render('concentration_reqs', {title: "Engineering Major Requirements"});
}
var Student = require('../models/student')
var Course = require('../models/course')
var PlanOfStudy = require('../models/planOfStudy')


exports.displayForm = function(req, res){
  var name = req.session.json.name || "";
  var advisor = req.session.json.advisor.replace(/\s/g,'').replace(/PrimaryAdvisor/g,'').replace(/,/g,', ') || "";
	res.render('planOfStudyForm', {title: "Engineering Plan of Study", name: name, advisor: advisor});
}

var Student = require('../models/student')
var Course = require('../models/course')
var PlanOfStudy = require('../models/planOfStudy')


exports.displayForm = function(req, res){
  var name = req.session.json.name || "";
  var advisor = req.session.json.advisor.replace(/\s/g,'').replace(/PrimaryAdvisor/g,'').replace(/,/g,', ') || "";
  // NOTE TO TEST WHAT MY.OLIN.EDU RETURNS 
	res.render('planOfStudyForm', {title: "Engineering Plan of Study", name: name, advisor: advisor});
}

exports.saveForm = function(req, res){
	// check if the form already exists 
	PlanOfStudy.findOne({name: req.body.form_name}).exec(function (err, form){
		if(err)
			console.log("Error in checking whether form already exists: ", err);
		if(form != null){
			console.log("Detected an existent form, modifying it.");
			console.log("THE COURSES WE GET ARE: ", req.body.courses);
			form.update({name: req.body.form_name}, {adviser: req.body.adviser_name}, {grad_year: req.body.graduation_year}, {concentration_declaration: req.body.declaration})
		}else{
			console.log("Detected a yet-to-be-saved form!");
			console.log("THE COURSES WE GET ARE: ", req.body);
		}
	})
}

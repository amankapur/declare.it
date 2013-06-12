var Student = require('../models/student')

// home page is an index of all of a user's declaration forms

exports.display = function(req, res){
	console.log("THE CURRENT USER IS: ", req.session.user);
	var currStudent = Student.findOne({username: req.session.user.username}).populate('planOfStudy_forms').exec(function (err, student){
		if(err)
			console.log("Could not retrieve student: ", err);
		console.log("THE PLANS OF STUDY ARE: ", student.planOfStudy_forms);
		res.render('home', {title: 'My Forms', plans: student.planOfStudy_forms});
	})
};
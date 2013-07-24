var Student = require('../models/student')
var Course = require('../models/course')
var PlanOfStudy = require('../models/planOfStudy')


exports.displayReqs = function(req, res){
	res.render('concentration_reqs', {title: "Engineering Major Requirements"});
}

exports.eBiology = function(req, res){
	res.render('reqs_eBio', {title: "Engineering: Bioengineering"});
}

exports.eComputing = function(req, res){
	res.render('reqs_eComputing', {title: "Engineering: Computing"});
}

exports.eDesign = function(req, res){
	res.render('reqs_eDesign', {title: "Engineering: Design"});
}

exports.eMatsci = function(req, res){
	res.render('reqs_eMatsci', {title: "Engineering: Materials Science"});
}

exports.eSystems = function(req, res){
	res.render('reqs_eSystems', {title: "Engineering: Systems"});
}
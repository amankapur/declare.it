var Student = require('../models/student')
var Course = require('../models/course')
var PlanOfStudy = require('../models/planOfStudy')
var async = require('async');


exports.displayForm = function(req, res){
  var name = req.session.json.name || "";
  var advisor = req.session.json.advisor.replace(/\s/g,'').replace(/PrimaryAdvisor/g,'').replace(/,/g,', ') || "";
  // NOTE TO TEST WHAT MY.OLIN.EDU RETURNS 
  res.render('planOfStudyForm', {title: "Engineering Plan of Study", name: name, advisor: advisor});
}

exports.saveForm = function(req, res){
	// check if the form already exists in the student's array of Plans of Study
	Student.findOne({username: req.session.user.username}).populate('planOfStudy_forms').exec(function (err, student){
		if(err)
			console.log("Error in checking whether form already exists: ", err);
		// doing a filler condition right now in order to test the other case, eventually need to check if plan of study is in planOfStudy_forms array 
		if(student != null && student.planOfStudy_forms.length > 10){
			console.log("Detected an existent form, modifying it.");
			//form.update({name: req.body.form_name}, {adviser: req.body.adviser_name}, {grad_year: req.body.graduation_year}, {concentration_declaration: req.body.declaration}, {courses: [req.body.course1, req.body.course2, req.body.course3, req.body.course4, req.body.course5, req.body.course6, req.body.course7, req.body.course8]})
		}else{
			console.log("Detected a yet-to-be-saved form (below length 10)!");
			var courseList = [];
			var arr = [];
			var newPlanOfStudy; 

			async.auto({
				ingesting_user_data: function(callback){
					// combine each individual course entry into array of info 
					var courseNames = [req.body.course1, req.body.course2, req.body.course3, req.body.course4, req.body.course5, req.body.course6, req.body.course7, req.body.course8];
					var courseMTH = [req.body.course1_MTH, req.body.course2_MTH, req.body.course3_MTH, req.body.course4_MTH, req.body.course5_MTH, req.body.course6_MTH, req.body.course7_MTH, req.body.course8_MTH];
					var courseSCI = [req.body.course1_SCI, req.body.course2_SCI, req.body.course3_SCI, req.body.course4_SCI, req.body.course5_SCI, req.body.course6_SCI, req.body.course7_SCI, req.body.course8_SCI];
					var courseENGR = [req.body.course1_ENGR, req.body.course2_ENGR, req.body.course3_ENGR, req.body.course4_ENGR, req.body.course5_ENGR, req.body.course6_ENGR, req.body.course7_ENGR, req.body.course8_ENGR];
					var courseAHSE = [req.body.course1_AHSE, req.body.course2_AHSE, req.body.course3_AHSE, req.body.course4_AHSE, req.body.course5_AHSE, req.body.course6_AHSE, req.body.course7_AHSE, req.body.course8_AHSE];

					// combine each individual course entry into array of info 
					for(var i=0; i<courseNames.length; i++){
						arr.push({
							courseName: courseNames[i], 
							MTH: courseMTH[i], 
							SCI: courseSCI[i], 
							ENGR: courseENGR[i], 
							AHSE: courseAHSE[i]
						});
					}
					// upon successful completion of course list creation, call callback
					callback(null);
				}, 
				populating_course_list: ['ingesting_user_data', function(callback){
					// create a list of course objects 
					async.map(arr, function(item, next){
						var courseType; 
						var courseCredits;
						if(item.MTH != 0){
							courseType = 'MTH';
							courseCredits = item.MTH;
						}else{
							if(item.SCI != 0){
								courseType = 'SCI';
								courseCredits = item.SCI;
							}else{
								if(item.ENGR != 0){
									courseType = 'ENGR';
									courseCredits = item.ENGR;
								}else{
									if(item.AHSE != 0){
										courseType = 'AHSE';
										courseCredits = item.AHSE;
									}else{
										courseType = '';
										courseCredits = '';
									}
								}
							}
						}	
						// for right now, all non-pertinent attributes are just empty strings 
						var newCourse = new Course({section: '', name: item.courseName, credit: courseCredits, grade: '', type: courseType, id: ''});
						newCourse.save(function(err){
							if(err)
								console.log("Couldn't save the new course: ", err);
							courseList.push(newCourse);
							next(null);
						});
					}, function(err, results){
						callback(null, results);
					});
				}], 
				create_planOfStudy: ['populating_course_list', function(callback, results){
					newPlanOfStudy = new PlanOfStudy({name: req.body.form_name, adviser: req.body.adviser_name, grad_year: req.body.graduation_year, concentration_declaration: req.body.declaration_title, nested: {courses: courseList, MTH_credits: req.body.total_MTH, SCI_credits: req.body.total_SCI, ENGR_credits: req.body.total_ENGR, AHSE_orOther_credits: req.body.total_AHSE, additional_electives_MTH: req.body.additional_MTH,  additional_electives_SCI: req.body.additional_SCI, additional_electives_ENGR: req.body.additional_ENGR, additional_electives_AHSE: req.body.additional_AHSE}, overlap_toggle_allOlin: req.body.overlap_allOlin_toggle, course_plan_story: req.body.course_plan_text, chem_matsci_req: req.body.chem_matsci, phys_req: req.body.phys, design_depth_req: req.body.design_depth, overlap_toggle_chemMatsciDesign: req.body.overlap_chemMatsci_toggle});
					newPlanOfStudy.save(function (err){
						if(err)
							console.log("Unable to create and save new plan of study: ", err);
						callback(null, 'done');
					});
				}], 
				update_userPlanList: ['create_planOfStudy', function(callback){
					var currPlanList = student.planOfStudy_forms; 
					console.log("The user's current list of plans of study is: ", currPlanList);
					console.log("The plan we're adding on is: ", newPlanOfStudy);
					currPlanList.push(newPlanOfStudy); 
					console.log("After we've added it on: ", currPlanList);
					student.planOfStudy_forms = currPlanList; 
					student.save(function (err){
						if(err)
							console.log("Unable to update student's profile: ", err);
						console.log("Successful plan creation and updating of student profile: ", student.planOfStudy_forms);
					})
				}], 
			}, function (err, result){
				// final callback
				console.log("Successfully ingested and created new Plan of Study");
			})
		}
	}); 
}


// delete all Plans of Study associated with a student
exports.delete_all_student = function(req, res){
	Student.findOne({username: req.session.user.username}).update({planOfStudy_forms: []}).exec(function (err){
		if(err)
			console.log("Could not remove student's plans of study: ", err);
		res.redirect('/home');
	});
}

// delete all forms in the database 
exports.delete_all = function(req, res){
  PlanOfStudy.remove().exec(function(err) { 
      console.log('Plan of Study collection emptied');
      res.redirect('/');
  });
}

// list all Plans of Study associated with a student [DEBUG PURPOSES ONLY]
exports.enumerate_plans = function(req, res){
	Student.findOne({username: req.session.user.username}).populate('planOfStudy_forms').exec(function (err, student){
		console.log("THE STUDENT WE'RE GETTING BACK IS: ", student);
		for(var i=0; i< student.planOfStudy_forms.length; i++){
			console.log("THE STUDENT'S PLANS OF STUDY ARE: ", student.planOfStudy_forms[i]);
		}
	});
}

// BACKDOOR DISPLAY FORM: created when no internet access for sis login
exports.backdoorDisplay = function(req, res){
	res.render('planOfStudyForm', {title: "Engineering Plan of Study", name: 'Margaret-Ann Seger', advisor: 'John Geddes'});
}





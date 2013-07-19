var mongoose = require('mongoose'), Schema = mongoose.Schema

var planOfStudySchema = new Schema({
	name: String, 
	student_name: String, 
	adviser: String, 
	grad_year: Number, 
	concentration_declaration: String,
	courses: [{type: Schema.Types.ObjectId, ref: 'Course'}], 
	MTH_credits: Number,  
	SCI_credits: Number, 
	ENGR_credits: Number, 
	AHSE_orOther_credits: Number, 
	additional_electives_MTH: Number, 
	additional_electives_SCI: Number, 
	additional_electives_ENGR: Number, 
	additional_electives_AHSE: Number,
	overlap_toggle_allOlin: Boolean, 
	course_plan_story: String, 
	chem_matsci_req: String, 
	phys_req: String, 
	design_depth_req: String, 
	overlap_toggle_chemMatsciDesign: Boolean
});

var PlanOfStudy = mongoose.model('PlanOfStudy', planOfStudySchema);

module.exports = PlanOfStudy;
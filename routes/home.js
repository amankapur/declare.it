
// home page is an index of all of a user's declaration forms

exports.display = function(req, res){
	console.log("THE CURRENT USER IS: ", req.session.user);
	res.render('home', { title: 'My Forms' });
};
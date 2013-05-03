

exports.index = function(req, res){
	res.render('form', { title: 'Declare.it' });
};

exports.fakeData = function(req, res){

	data = {
		'large12': 'yo mama',
		'large4.1' : 'my mama',
		'large4.2' : 'his mama',
		'small9' : 'dafuq',
		'small12' : "I'm SEXY and I know it"
	}

	res.send(data);
}
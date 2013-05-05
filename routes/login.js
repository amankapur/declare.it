
var scrapi = require('scrapi');

// var api = scrapi({
//   "base": "https://my.olin.edu/",
//   "spec": {
//     "/ICS/My_StAR/My_Grades_and_Transcript.jnz?portlet=Unofficial_Transcript_OLIN": {
//       "classes": {
//         "$query": "tr[align=center] tr.glbdatadark",
//         "$each": "(html) td:nth-child(1)"
//       }
//     }
//   }
// });

// function getGrades (sess, year, next) {
//   api('setopt.cgi').post({
//     prog:"UNDG",
//     sess: sess,
//     yr: year,
//     setopt_command: "Submit Options",
//     action: "https://sis.olin.edu/cgi-bin/student/stugrds.cgi"
//   }, function (err) {
//     console.log('Reading', sess, year);
//     api('stugrds.cgi').get(function (err, json, res) {
//       json.classes = (json.classes || []).map(function (c) {
//         var data = c.replace(/<br>/g, ' ').replace(/<\/td>/g, '').split('<td valign="top">');
//         return {
//           section: data[1],
//           name: data[2].replace(/^\s+|\s+$/g, ''),
//           credit: parseFloat(data[3]),
//           grade: data[4],
//           type: data[0].replace(/\d.*$/, ''),
//           number: data[0].replace(/^[a-z]+/i, ''),
//           id: data[0]
//         };
//       });

//       next(err, json);
//     });
//   });
// }


exports.login = function(req, res){
    res.render('login_page', {title: 'Declare.it'});
};

exports.doLogin = function(req, res){
    username = req.body.username;
    pw = req.body.password;

    console.log("username", username);
    // console.log('pw', pw);

    req.session.user = username;

    // console.log(getCourseInfo(username, pw));

    res.redirect('/');

};

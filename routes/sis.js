var scrapi = require('scrapi');
var async = require('async');

var api = scrapi({
    "base": "https://sis.olin.edu/cgi-bin/student",
    "spec": {
        "/cgi-bin/student/stugrds.cgi": {
            "classes": {
                "$query": "tr[align=center] tr.glbdatadark",
                "$each": "(html) td:nth-child(1)"
            }
        }
    }
});

function getGrades(sess, year, next) {
    api('setopt.cgi')
        .post({
        prog: "UNDG",
        sess: sess,
        yr: year,
        setopt_command: "Submit Options",
        action: "https://sis.olin.edu/cgi-bin/student/stugrds.cgi"
    }, function(err) {
        console.log('Reading', sess, year);
        api('stugrds.cgi')
            .get(function(err, json, res) {
            json.classes = (json.classes || [])
                .map(function(c) {
                var data = c.replace(/<br>/g, ' ')
                    .replace(/<\/td>/g, '')
                    .split('<td valign="top">');
                return {
                    section: data[1],
                    name: data[2].replace(/^\s+|\s+$/g, ''),
                    credit: parseFloat(data[3]),
                    grade: data[4],
                    type: data[0].replace(/\d.*$/, ''),
                    number: data[0].replace(/^[a-z]+/i, ''),
                    id: data[0]
                };
            });

            next(err, json);
        });
    });
}


var getCourseInfo = function(username, password){

    api.pre('request', function(req) {
        req.headers.authorization = 'Basic ' + new Buffer(username + ':' + password, 'utf-8')
            .toString('base64');


    async.mapSeries([
        ['FA', 2009],
        ['SP', 2010],
        ['FA', 2010],
        ['SP', 2011],
        ['FA', 2011],
        ['SP', 2012],
        ['FA', 2012],
        ['SP', 2013]
    ], function(arg, next) {
        getGrades(arg[0], arg[1], next);
    }, function(err, json) {
        var classes = Array.prototype.concat.apply([], json.map(function(a) {
            return a.classes;
        }));
        console.log(classes);

        // Tally credits.
        var credits = classes.reduce(function(last, c) {
            last[c.type] || (last[c.type] = 0);
            last[c.type] += c.credit;
            return last;
        }, {})
        console.log('\ncredits:', credits);
    });

});

}
exports.login = function(req, res){
    res.render('login_page', {title: 'Declare.it'});
};

exports.doLogin = function(req, res){
    username = req.body.username;
    pw = req.body.password;

    console.log("username", username);
    console.log('pw', pw);

    req.session.user = username;

    res.redirect('/');

};

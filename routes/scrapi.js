var scrapi = require('scrapi');
var async = require('async');

var api = scrapi({
  "base": "http://reyner.be",
  "spec": {
    "/files/transcript.html": {
      "$query": "table#pg0_V_tblTermData tr",
      "$each": {
        "$query": "td",
        "$each": "(text)"
      }
    }
  }
});

function getEmpty(o, prop) {
  if (o[prop] !== undefined) return o[prop];
  else return [];
}

exports.sortByDistribution = function(req,res) {
  api('/files/transcript.html').get(function (err, json) {
    var distributions = ["AHSE", "ENGR", "MTH", "SCI", "OIE", "CC", "AWAY"];
    var i, j, k, course, title, grade, credits, internal;
    var out = [];
    for (i = 0; i < distributions.length; i++) {
      internal = [];
      for (j = 0; j < json.length; j++) {
        for (k = 0; k< json[j].length; k++) {
          if (json[j][k].indexOf(distributions[i]) == 0 && json[j][k].length > distributions[i].length) {
            course = json[j][k];
            title = json[j][k+1];
            grade = json[j][k+2];
            credits = json[j][k+4];
            if (grade != "F" || grade != "NC") {
              internal.push(course+ " "+title+"; "+credits+" credits of "+distributions[i]+".");
            }
          }
        }
      }
      out.push(internal);
    }
    res.json(out);
  })
}

exports.run = function(req,res) {
  var conc = req.query.conc;
  var filter_hash = 
    {
      'bio': ['bio Math', 'biology', 'bio chemistry', 'bio materials', 'bioengineering'],
      'computing': ['discrete', 'software design', 'foundations of computer science', 'software systems'],
      'matsci': ['differntial equations', 'material science'],
      'systems': ['signals and systems', 'introduction to microelectronics circuits', 'software design', 'computer architecture', 'analog and digital communications', 'mechanics of solids and structures', 'dynamics', 'thermodynamics', 'transport phenomena', 'mechanical design', 'systems']
    }
  var relevant = filter_hash[conc];

  api('/files/transcript.html').get(function (err, json) {
    var distributions = ["AHSE", "ENGR", "MTH", "SCI", "OIE", "CC", "AWAY"];
    var i, j, k, l, course, title, grade, credits, internal;
    var out = [];
    for (i = 0; i < distributions.length; i++) {
      internal = [];
      for (j = 0; j < json.length; j++) {
        for (k = 0; k< json[j].length; k++) {
          if (json[j][k].indexOf(distributions[i]) == 0 && json[j][k].length > distributions[i].length) {
            course = json[j][k];
            title = json[j][k+1];
            grade = json[j][k+2];
            credits = json[j][k+4];
            console.log(title);
            for (l = 0; l< relevant.length; l++){
              if (title.toLowerCase().indexOf(relevant[l]) >= 0) {
                if (grade != "F" && grade != "NC") {
                  internal.push(course+ " "+title+"; "+credits+" credits of "+distributions[i]+".");
                }
              }
            }
          }
        }
      }
      out.push(internal);
    }
    res.json(out);
  })
}
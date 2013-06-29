var scrapi = require('scrapi');
var async = require('async');
var Student = require('../models/student')

var api = scrapi({
  "base": "https://my.olin.edu/",
  "spec": {
    "/ICS/": {
      "loginform": {
        "__VIEWSTATE": {
          $query: "#__VIEWSTATE",
          $value: "(attr value)"
        },
        "___BrowserRefresh": {
          $query: "#___BrowserRefresh",
          $value: "(attr value)"
        }
      }
    },
    "/ICS/My_StAR/My_Grades_and_Transcript.jnz": {
      classes: {
        $query: "#pg0_V_tblTermData tr",
        $each: {
          $query: "td",
          $each: "(text)"
        }
      },
      advisor: {
        $query: "table#tblRight tr:nth-child(1) td:nth-child(2)",
        $value: "(text)"
      },
      name: {
        $query: "#userWelcome strong",
        $value: "(text)"
      }
    }
  }
});

exports.login = function (req, response) {
  api('/ICS/').get(function (err, json) {
    api('/ICS/').post({
      "__VIEWSTATE": json.loginform.__VIEWSTATE,
      "___BrowserRefresh": json.loginform.___BrowserRefresh,
      "userName": req.body.username,
      "password": req.body.password,
      "btnLogin": "Login"
    }, function (err, html, res) {
      if (res.statusCode != 302) {
        throw new Error('Invalid login.');
      }

      api('/ICS/My_StAR/My_Grades_and_Transcript.jnz').get({
        portlet: "Unofficial_Transcript_OLIN"
      }, function(err, json) {
        //req.session.user = req.body.username;

        // CASE: student has already logged in, exists in our system
        var existentStudent = Student.findOne({username: req.body.username}).exec(function (err, student){
          if(student){
            req.session.user = student; 
            req.session.json = json;
            response.redirect('/');
          }else{
            // CASE: student logging into our system for the first time
            var time = Date.now();
            var newStudent = new Student({created: time, domain: 'olin', username: req.body.username, email: '', planOfStudy_forms: []});
            newStudent.save(function (err){
              if(err)
                console.log("Couldn't create new student in system: ", err);
              req.session.user = newStudent; 
              req.session.json = json;
              response.redirect('/');
            });
          }
        });
        //req.session.json = json;
        //response.redirect('/');
      });
    });
  });
}


var getValues = function (obj) {
    var vals = [];
    for( var key in obj ) {
        if ( obj.hasOwnProperty(key) ) {
            vals.push(obj[key]);
        }
    }
    return vals;
}
exports.run = function(req,res) {
  var conc = req.body.conc;
  var filter_hash = 
    {
      'bio': ['bio Math', 'biology', 'bio chemistry', 'bio materials', 'bioengineering'],
      'computing': ['discrete', 'software design', 'foundations of computer science', 'software systems'],
      'matsci': ['differntial equations', 'material science'],
      'systems': ['signals and systems', 'introduction to microelectronics circuits', 'software design', 'computer architecture', 'analog and digital communications', 'mechanics of solids and structures', 'dynamics', 'thermodynamics', 'transport phenomena', 'mechanical design', 'systems']
    }
  var relevant = filter_hash[conc];

  json = req.session.json;
  //console.log(json);
  //console.log("***********************");
  var distributions = ["AHSE", "ENGR", "MTH", "SCI", "OIE", "CC", "AWAY"];
  var i, j, k, l, course, title, grade, credits, internal;
  var out = [];
  data = {}
  for (i = 0; i < distributions.length; i++) {
    internal = [];

    for (j = 0; j < json.classes.length; j++) {
      for (k = 0; k< json.classes[j].length; k++) {
        if (json.classes[j][k].indexOf(distributions[i]) == 0 && json.classes[j][k].length > distributions[i].length) {
          course = json.classes[j][k];
          title = json.classes[j][k+1];
          grade = json.classes[j][k+2];
          credits = json.classes[j][k+4];
          // console.log(title);
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
  count = 1;
  sum_ENGR = 0;
  sum_SCI =0;
  sum_MTH =0;
  sum_AHSE =0;

  additional_AHSE =0;
  additional_SCI =0;
  additional_MTH =0;
  additional_ENGR =0;

  allschool_AHSE =0;
  allschool_MTH =8;
  allschool_SCI =14;
  allschool_ENGR =30;

  totalsum_AHSE = 0;
  totalsum_MTH = 0;
  totalsum_SCI = 0;
  totalsum_ENGR = 0;


  for (i =0; i < out.length; i++){
    if (out[i] != []){
      for(j = 0; j< out[i].length; j++){
        if (getValues(data).indexOf(out[i][j]) == -1){
          coursenum = 'course' + count;
          main = out[i][j]
          
          arr = main.split(';');
          //console.log(arr);
          //console.log(coursenum);
          data[coursenum] = arr[0]

          arr = arr[1].split(' ');

          type = arr[4];

          data[coursenum+'_ENGR'] = '0';
          data[coursenum+'_AHSE'] = '0';
          data[coursenum+'_SCI'] = '0';
          data[coursenum+'_MTH'] = '0';
          // console.log(arr);
          // console.log(type);
          switch(type)
          {
            case 'ENGR.':
              data[coursenum+'_ENGR'] = parseInt(arr[1]);
              sum_ENGR += parseInt(arr[1]);
              break;
            case 'SCI.':
              data[coursenum+'_SCI'] = parseInt(arr[1]);
              sum_SCI += parseInt(arr[1]);
              break;
            case 'MTH.':
              data[coursenum+'_MTH'] = parseInt(arr[1]);
              sum_MTH += parseInt(arr[1]);
              break;
            case 'AHSE.':
              data[coursenum+'_AHSE'] = parseInt(arr[1]);
              sum_AHSE += parseInt(arr[1]);
              break;
            
          }


          count +=1;
        }
      }
    }
  }

  totalsum_AHSE = sum_AHSE + additional_AHSE + allschool_AHSE;
  totalsum_SCI = sum_SCI + additional_SCI + allschool_SCI;
  totalsum_MTH = sum_MTH + additional_MTH + allschool_MTH;
  totalsum_ENGR = sum_ENGR + additional_ENGR + allschool_ENGR;

  data['subtotal_ENGR'] = sum_ENGR;
  data['subtotal_MTH'] = sum_MTH;
  data['subtotal_SCI'] = sum_SCI;
  data['subtotal_AHSE'] = sum_AHSE;

  data['additional_AHSE'] = additional_AHSE;
  data['additional_SCI'] = additional_SCI;
  data['additional_MTH'] = additional_MTH;
  data['additional_ENGR'] = additional_ENGR;

  data['allSchool_AHSE'] = allschool_AHSE;
  data['allSchool_MTH'] = allschool_MTH;
  data['allSchool_SCI'] = allschool_SCI;
  data['allSchool_ENGR'] = allschool_ENGR;

  data['total_AHSE'] = totalsum_AHSE;
  data['total_MTH'] = totalsum_MTH;
  data['total_SCI'] = totalsum_SCI;
  data['total_ENGR'] = totalsum_ENGR;

  res.send(data);
}


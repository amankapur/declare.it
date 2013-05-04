var scrapi = require('scrapi');
var async = require('async');

var api_static = scrapi({
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
      "$query": "table#pg0_V_tblTermData tr",
      "$each": {
        "$query": "td",
        "$each": "(text)"
      }
    }
  }
});

function myLogin (username, password, next) {
  api('/ICS/').get(function (err, json) {
    api('/ICS/').post({
      "__VIEWSTATE": json.loginform.__VIEWSTATE,
      "___BrowserRefresh": json.loginform.___BrowserRefresh,
      "userName": username,
      "password": password,
      "btnLogin": "Login"
    }, function (err, html, res) {
      if (res.statusCode != 302) {
        throw new Error('Invalid login.');
      }

      api('/ICS/My_StAR/My_Grades_and_Transcript.jnz').get({
        portlet: "Unofficial_Transcript_OLIN"
      }, next);
    });
  });
}

exports.sortByDistribution = function(req,res) {
  myLogin(req.session.username, req.session.pw, function (err, json) {
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
  console.log("username " + req.session.user)
  var conc = req.body.conc;
  var filter_hash = 
    {
      'bio': ['bio Math', 'biology', 'bio chemistry', 'bio materials', 'bioengineering'],
      'computing': ['discrete', 'software design', 'foundations of computer science', 'software systems'],
      'matsci': ['differntial equations', 'material science'],
      'systems': ['signals and systems', 'introduction to microelectronics circuits', 'software design', 'computer architecture', 'analog and digital communications', 'mechanics of solids and structures', 'dynamics', 'thermodynamics', 'transport phenomena', 'mechanical design', 'systems']
    }
  var relevant = filter_hash[conc];
  console.log(relevant);
 
  // console.log(filter_hash[conc]);

  myLogin(req.session.user, req.session.pw, function (err, json) {
    console.log(json);
    var distributions = ["AHSE", "ENGR", "MTH", "SCI", "OIE", "CC", "AWAY"];
    var i, j, k, l, course, title, grade, credits, internal;
    var out = [];
    data = {}
    for (i = 0; i < distributions.length; i++) {
      internal = [];

      for (j = 0; j < json.length; j++) {
        for (k = 0; k< json[j].length; k++) {
          if (json[j][k].indexOf(distributions[i]) == 0 && json[j][k].length > distributions[i].length) {
            course = json[j][k];
            title = json[j][k+1];
            grade = json[j][k+2];
            credits = json[j][k+4];
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
            console.log(arr);
            console.log(coursenum);
            data[coursenum] = arr[0]

            arr = arr[1].split(' ');

            type = arr[4];

            data[coursenum+'-ENGR'] = '0';
            data[coursenum+'-AHSE'] = '0';
            data[coursenum+'-SCI'] = '0';
            data[coursenum+'-MTH'] = '0';
            // console.log(arr);
            console.log(type);
            switch(type)
            {
              case 'ENGR.':
                data[coursenum+'-ENGR'] = parseInt(arr[1]);
                sum_ENGR += parseInt(arr[1]);
                break;
              case 'SCI.':
                data[coursenum+'-SCI'] = parseInt(arr[1]);
                sum_SCI += parseInt(arr[1]);
                break;
              case 'MTH.':
                data[coursenum+'-MTH'] = parseInt(arr[1]);
                sum_MTH += parseInt(arr[1]);
                break;
              case 'AHSE.':
                data[coursenum+'-AHSE'] = parseInt(arr[1]);
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

    data['subtotal-ENGR'] = sum_ENGR;
    data['subtotal-MTH'] = sum_MTH;
    data['subtotal-SCI'] = sum_SCI;
    data['subtotal-AHSE'] = sum_AHSE;

    data['additional-AHSE'] = additional_AHSE;
    data['additional-SCI'] = additional_SCI;
    data['additional-MTH'] = additional_MTH;
    data['additional-ENGR'] = additional_ENGR;

    data['allSchool-AHSE'] = allschool_AHSE;
    data['allSchool-MTH'] = allschool_MTH;
    data['allSchool-SCI'] = allschool_SCI;
    data['allSchool-ENGR'] = allschool_ENGR;

    data['total-AHSE'] = totalsum_AHSE;
    data['total-MTH'] = totalsum_MTH;
    data['total-SCI'] = totalsum_SCI;
    data['total-ENGR'] = totalsum_ENGR;

    res.send(data);
  })
}


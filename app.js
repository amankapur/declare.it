
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , form = require('./routes/form')
  , http = require('http')
  , olinapps = require('olinapps')
  , scrapiroute = require('./routes/scrapi')
  , login = require('./routes/login')
  , concentrationReqs = require('./routes/concentration_reqs')
  , home = require('./routes/home')
  , path = require('path')
  , planOfStudy = require('./routes/planOfStudy')
  , mongoose = require('mongoose');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
  app.set('host', 'localhost:3000');
  app.use(express.errorHandler());
  mongoose.connect(process.env.MONGOLAB_URI || 'localhost');
});


app.configure('production', function () {
  // app.set('host', 'quotes.olinapps.com');
});

var loginRequired = function(){
  return function(req, res, next) {
    user = req.session.user;    
      if (!user){

        res.redirect("/login");
      } else {
        next();
      }
    }
}

app.get('/', loginRequired(), planOfStudy.displayForm);
app.get('/scrapi', scrapiroute.run);
app.get('/login', login.login);
app.get('/home', loginRequired(), home.display);
app.get('/concentrationReqs', loginRequired(), concentrationReqs.displayReqs);
app.post('/login', scrapiroute.login);
app.get('/logout', loginRequired(), scrapiroute.logout);


app.post('/autoFill', scrapiroute.run);
app.post('/autoFillPlanInfo/:planID', planOfStudy.autoFillPlanInfo);
app.post('/studyPlan/save', loginRequired(), planOfStudy.saveForm);
app.get('/studyPlan/new', loginRequired(), planOfStudy.displayForm);
app.post('/studyPlan/:planID', loginRequired(), planOfStudy.displayFilledForm);
app.get('/studyPlan/:planID', loginRequired(), planOfStudy.displayFilledForm);

// DEBUG
app.get('/enumeratePlans', planOfStudy.enumerate_plans); // <-- NEED TO GET RID OF THIS BEFORE WE SHIP!
app.get('/backdoorDisplay', planOfStudy.backdoorDisplay); // <-- NEED TO GET RID OF THIS BEFORE WE SHIP!
app.get('/delete_all_plans', planOfStudy.delete_all); // <-- NEED TO GET RID OF THIS BEFORE WE SHIP!




http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

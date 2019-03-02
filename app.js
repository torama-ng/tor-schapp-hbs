const hbs = require('handlebars');
hbs.registerHelper("equal", require("handlebars-helper-equal"))
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

// Connect to DB
const db = require('./config/keys').mongoURI;

mongoose
.connect(db,{ useNewUrlParser: true})
.then (() => console.log('connected to MongoDB'))
.catch(err => console.log(err));


const courses = require('./routes/courses/courseroutes');
const data = require('./routes/rdata/dataroutes');
const apiroutes = require('./routes/api/apiroutes');

const torplay = require('./routes/torplay');
const routes = require('./routes/index');
const users = require('./routes/users');
/*
const nodejs = require('./routes/nodejs');
const mongod = require('./routes/mongod');
const uploadv = require('./routes/uploadv');
const javascript = require('./routes/javascript');
const html = require('./routes/html');
const usermgt = require('./routes/usermgt');
const css = require('./routes/css');
const bootstrap = require('./routes/bootstrap');
const handlebars = require('./routes/handlebars');
const linux = require('./routes/linux');
const react = require('./routes/react');
const vue = require('./routes/vue');
const angular = require('./routes/angular');
const bash = require('./routes/bash'); 
*/
// Init App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({
    extname:'hbs',
    layoutsDir:__dirname+'/views/layouts/',
    partialsDir:__dirname+'/views/partials/',
    defaultLayout:'layout',

  }));
  
app.set('view engine', 'hbs');

//Handlebars Partial

// Handlebars helpers
hbs.registerHelper("equal", require("handlebars-helper-equal"))

hbs.registerHelper('if_eq', function(a, b, opts) {
  if (a == b) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});

hbs.registerHelper('formatMe', function(txt) {

  txt = path.basename(txt,'.mp4');
  // console.log(txt);
  
  txt = txt.replace("%", "");
  txt = txt.replace("-", " ");
  txt = txt.replace("_", " ");
  txt = txt.replace(",", " ");
  txt = txt.replace("  ", " ");
  txt = txt.replace("   ", " ");
  
  // console.log(txt);
//   txt =  decodeURIComponent(txt) ;
  txt = txt.replace("-", " ");
  return titleCase(txt);

  function titleCase(str) {
    return str.toLowerCase().split(' ').map(function(word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }

});


// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'videos')));


// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  res.locals.title = "</>Torama Videonet"
  next();
});

// Routes
// app.use('/api/videos',videoRoutes);
app.use('/torplay',torplay);
app.use('/api',apiroutes);

app.use('/courses',courses);
app.use('/data',data);
app.use('/', routes);
app.use('/users', users);
/*
app.use('/nodejs', nodejs);
app.use('/javascript', javascript);
app.use('/mongod', mongod);
app.use('/uploadv', uploadv);
app.use('/html', html);
app.use('/css', css);
app.use('/bootstrap', bootstrap);
app.use('/handlebars', handlebars);
app.use('/usermgt', usermgt);
app.use('/react', react);
app.use('/angular', angular);
app.use('/vue', vue);
app.use('/linux', linux);
app.use('/bash', bash);
// app.use('/fbrowser', fbrowseRoutes);
*/
module.exports = app;

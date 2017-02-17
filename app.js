var authConfig = require('./config/auth'),
  express = require('express'),
  jade = require('jade'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
  User = require('./models/users.js'),
  bodyParser = require('body-parser');

// Passport session setup.
//
//   For persistent logins with sessions, Passport needs to serialize users into
//   and deserialize users out of the session. Typically, this is as simple as
//   storing the user ID when serializing, and finding the user by ID when
//   deserializing.
passport.serializeUser(function(user, done) {
  // done(null, user.id);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  // Users.findById(obj, done);
  done(null, obj);
});


// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
//   See http://passportjs.org/docs/configure#verify-callback
passport.use(new GoogleStrategy(

  // Use the API access settings stored in ./config/auth.json. You must create
  // an OAuth 2 client ID and secret at: https://console.developers.google.com
  authConfig.google,

  function(accessToken, refreshToken, profile, done) {

    // Typically you would query the database to find the user record
    // associated with this Google profile, then pass that object to the `done`
    // callback.
    var query = User.findOne({ 'google_id': profile.id});

    // selecting the `name` and `occupation` fields
    query.select('google_id email name permissions');

    // execute the query at a later time
    query.exec(function (err, person) {
       if (err) return handleError(err);
        if (person === null){
          newUser = new User({
            google_id: profile.id,
            email: profile.emails[0].value,
            fullname: profile.name.givenName +" "+ profile.name.familyName,
            name: {
              first: profile.name.givenName,
              last: profile.name.familyName
            },
            permissions: {
              teacher: false,
              change_template: false,
              view_absents: false,
              admin: false
              }
          })
          newUser.save(function (err) {
            if (err) console.log(err)
            console.log('New user just registered! Email :' + profile.emails[0].value +'!');
            return done(err, newUser)
          })
        } else if (person) {
          console.log('Welcome back ' + person.name.first + ' ' + person.name.last);
          return done(err, person)
        }
      })
  }
));


// Express 4 boilerplate

var app = express();
app.set('view engine', 'jade');

var logger = require('morgan');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var session = require('express-session');

mongoose.connect('mongodb://localhost/schedule2');

app.use(logger('dev'));
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));

app.use('/public', express.static(__dirname + '/public'));


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(passport.initialize());
app.use(passport.session());

app.use(methodOverride('_method'));

/*
  Routes
*/

app.use('/', require('./routes/routes'));
app.use('/class', require('./routes/class'));
app.use('/admin', require('./routes/admin')); //Check permissions 
app.use('/schedule', require('./routes/schedule'));
app.use('/absents', require('./routes/absents'));

module.exports = app;

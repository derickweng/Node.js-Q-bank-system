var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var mongoose = require('mongoose');
var session = require('express-session');
var http = require('http');
var routes = require('./routes/index');
var users = require('./routes/users');

global.dbStudy = require('./database/dbStudy');
global.db = mongoose.connect("mongodb://localhost:27017/gdutstudy");
var app = express();
app.use(session({ 
	secret: 'secret',
	cookie:{ 
		maxAge: 1000*60*30*300
	}
}));

app.set('views', path.join(__dirname, 'views'));
app.engine("html",require("ejs").__express); 
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/GDUT.ico'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){ 
	res.locals.user = req.session.user;
	var err = req.session.error;
	delete req.session.error;
	res.locals.message = "";
	if(err){ 
		res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red;">'+err+'</div>';
	}
	next();
});

app.use('/', routes);  // 即为为路径 / 设置路由
app.use("/study_unsigned",routes);
app.use('/login',routes); // 即为为路径 /login 设置路由
app.use('/register',routes); // 即为为路径 /register 设置路由
app.use('/study_signed',routes); // 即为为路径 /home 设置路由
app.use("/logout",routes); // 即为为路径 /logout 设置路由
app.use("/error",routes); // 即为为路径 /error 设置路由
app.use("/message",routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404+"Not Found"+" 页面找不到啦";
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      // message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    // message: err.message,
    error: err
  });
});
var port = 8080;
http.createServer(app).listen(port,function(){
  console.log("server listening on port:"+port)
})
module.exports = app;

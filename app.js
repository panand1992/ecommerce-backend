var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const { httpCodes, httpColorCodes } = require("./src/constants/backendConfig");

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger(function(tokens, req, res) {
	// get status color
	var color = httpColorCodes.internalServerError;
	if (tokens.status(req, res) >= httpCodes.internalServerError) {
		color = httpColorCodes.internalServerError; //red
	} else if (tokens.status(req, res) >= httpCodes.badRequest) {
		color = httpColorCodes.badRequest; //yellow
	} else if (tokens.status(req, res) >= httpCodes.multipleChoices) {
		color = httpColorCodes.multipleChoices; //cyan
	} else if (tokens.status(req, res) >= httpCodes.success) {
		color = httpColorCodes.success; // green
	} else {
		color = 0; // no color
	}
	return [tokens.method(req, res),
		tokens.url(req, res),
		`\x1b[${color}m${tokens.status(req, res)}`,
		`\x1b[0m${tokens["response-time"](req, res)}ms - `,
		tokens.res(req, res, "content-length"),
		" - ",
		tokens.date(req, res, "iso"),
		JSON.stringify(req.headers),
		JSON.stringify(req.body)].join(" ");
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;

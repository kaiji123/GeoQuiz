var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

var cors = require('cors')


require('dotenv').config()



//one router per page
var indexRouter = require('./routes/index');
var apiRouter   = require('./routes/api/v1/api.js');
port = 3000







var app = express();

app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

//use this for version 1 of our api
app.use('/api/v1', apiRouter);


const swaggerOptions = {
  
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "3.0.0",
      title: "GEOquiz API",
      description: "You can find out more about GEOquiz at "
      + "[GEOquiz](https://geo-quiz.xyz/about).",
      termsOfUse: "https://geo-quiz.xyz/terms-of-use",
      support: "https://geo-quiz.xyz/support"
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Development server',
      },{
        url: 'https://geo-quiz.xyz/api/v1',
        description: 'Production server'
      }]
  },
   
  apis: ['./routes/**/**.js']
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log(req)
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = app;



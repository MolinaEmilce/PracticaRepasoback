var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var session = require('express-session'); //se instala npm insatall express-session --save
var cookieParser = require('cookie-parser'); //se instalo npm install cookie-parser --save

//middlewares
var localsCheck = require('./middlewares/localsCheck');
var cookieCheck = require('./middlewares/cookieCheck');

//Rutas
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();

// IMPORTANTE: Configuracion de las carpetas que contienen las vistas ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//-----------------------------------------------------------

app.use(logger('dev'));
//---Configuracion de capturacion de formulario:  es decir que al hacer req.body, podemos obetenr los datos que se envian por formulario, los captura y pueda capturarlos  y los convierte json y objetos literales
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//-----------------------------------------------------
//-------configuracion  para que los metodos funcionen en todos los navegadores------
const methodOverride = require('method-override'); //instalamos npm install method-override

app.use(methodOverride('_method')); //el string q se usa para implementarlo el metodo en el formulario
//-------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public'))); //Configuracion de recursos estaticos( visualizacion de imagenes videos y etx)
//---------------Configuracion de SESSION ---------------------
//dentro de la variable session tiene que recibir un objeto literal c
app.use(session({
  secret : "mi secreto"
}));

app.use(localsCheck) //cada vez que entra verifica si esta levantado session
//-----------------------------------------------------------------
//_------------Configuracion de cookie----------------
app.use(cookieParser()); //se toma como middleware de aplicacion, es decir esa variable va a ser utilizada en todo el proyecto
app.use(cookieCheck);
//-----------------------------------------------------------

//--------------RUTAS---------------------------use es un midlewares de aplicacion es decir que se va a manipular en toda la aplicacion
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
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

module.exports = app;

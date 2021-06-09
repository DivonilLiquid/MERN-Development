const express = require('express');

const morgan = require('morgan');

const app = express(); //express() is a function which on calling adds bunch of method in app

const tourRoute = require('./route/tourRouter');
const userRoute = require('./route/userRouter');

// 2) Middlewares

app.use(morgan('dev')); //Concise output colored by response status for development use. The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.

app.use(express.json()); //middleware used to modify incoming responses

app.use(express.static(`${__dirname}/public`)); //static file path where url will be -> http://127.0.0.1:3000/overview.html

app.use((req, res, next) => {
  console.log('Hello from own middleware 👋🏻');
  req.requestTime = new Date().toISOString(); // new Date() is a constructor
  next(); //very important to implement next stacked middlewares
});

app.get('/', (req, res) => {
  //http method get used to get the infromation
  res.status(200).send('Hello response from server');
});

app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);

module.exports = app;

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const cookieParser = require('cookie-parser');

const app = express(); //express() is a function which on calling adds bunch of method in app
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRoute = require('./route/tourRouter');
const userRoute = require('./route/userRouter');
const reviewRoute = require('./route/reviewRouter');
const viewRoute = require('./route/viewRoutes');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// 1) Global Middlewares
//serving static file
//static file path where url will be -> http://127.0.0.1:3000/overview.html
app.use(express.static(path.join(__dirname, 'public')));
//set securing http headers
// app.use(helmet());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", 'data:', 'blob:', 'https:', 'ws:'],
        baseUri: ["'self'"],
        fontSrc: ["'self'", 'https:', 'data:'],
        scriptSrc: [
          "'self'",
          'https:',
          'http:',
          'blob:',
          'https://*.mapbox.com',
          'https://js.stripe.com',
          'https://m.stripe.network',
          'https://*.cloudflare.com',
        ],
        frameSrc: ["'self'", 'https://js.stripe.com'],
        objectSrc: ["'none'"],
        styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
        workerSrc: [
          "'self'",
          'data:',
          'blob:',
          'https://*.tiles.mapbox.com',
          'https://api.mapbox.com',
          'https://events.mapbox.com',
          'https://m.stripe.network',
        ],
        childSrc: ["'self'", 'blob:'],
        imgSrc: ["'self'", 'data:', 'blob:'],
        formAction: ["'self'"],
        connectSrc: [
          "'self'",
          "'unsafe-inline'",
          'data:',
          'blob:',
          'https://*.stripe.com',
          'https://*.mapbox.com',
          'https://*.cloudflare.com/',
          'https://bundle.js:*',
          'ws://127.0.0.1:*/',
        ],
        upgradeInsecureRequests: [],
      },
    },
  })
);

//development logging
app.use(morgan('dev')); //Concise output colored by response status for development use. The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.

//denial of service, to stop brute force attack ->limtit request
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'to many requests from this ip, try after an hour',
});

app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); //middleware used to modify incoming responses
app.use(cookieParser());
//data santiziation against nosql query injection
app.use(mongoSanitize());

//data santiziation against xss
app.use(xss());

//prevent parameter pollution
app.use(
  hpp({
    // whitelist
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

//test middleware
app.use((req, res, next) => {
  console.log(req.cookies);
  next();
});
// app.get('/', (req, res) => {
//   //http method get used to get the infromation
//   res.status(200).send('Hello response from server');
// });

app.use('/', viewRoute);
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/review', reviewRoute);

//if no route is defined till here, then it the route defined below will get executed.
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on server`, 404));
});

//global error handling middleware
app.use(globalErrorHandler);

module.exports = app;

const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) Middleware

//* Can modify incoming req object - middleware, data from body is added to it hence req.body
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.static(`${__dirname}/public`));

//* Log when request happens with following middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//* GET REQUEST W/ OPTIONAL PARAM
// app.get('/api/v1/tours/:id/:x?', );

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;

import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import trainsModel from './models/trains.js';
import delayed from './routes/delayed.js';
import tickets from './routes/tickets.js';
import codes from './routes/codes.js';
import trains from './routes/trains.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import createError from 'http-errors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const httpServer = createServer(app); // Create the HTTP server instance

app.use(cors());
app.options('*', cors());

// For logging, uses morgan when not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var allowedOrigins = ['http://localhost:3000', 'http://localhost:1337', 'https://www.student.bth.se'];

const io = new Server (httpServer, {
  cors: {
    origin: function(origin, callback){
      // allow requests with no origin (like mobile apps or curl requests)
      if(!origin) return callback(null, true);
      if(allowedOrigins.indexOf(origin) === -1){
        var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    // origin: "http://localhost:3000, http://localhost:1337, https://www.student.bth.se",
    methods: ['GET', 'POST'],
  },
});

const port = process.env.PORT || 1337;
// const port = 1337;

app.get('/', (req, res) => {
  res.json({
    data: 'This is the API for the course jsramverk, by students glpa22 and haco22'
  });
});

app.use('/delayed', delayed);
app.use('/tickets', tickets);
app.use('/codes', codes);
app.use('/trains', trains);

// Start server
httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Used for moving trains
trainsModel.fetchTrainPositions(io);

// For 404-errors when accessing a route that doesn't exist
app.use((req, res, next) => {
  const err = new Error("Not Found");

  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
      return next(err);
  }

  res.status(err.status || 500).json({
      "errors": [
          {
              "status": err.status,
              "title":  err.message,
              "detail": err.message
          }
      ]
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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

export default httpServer;
// module.exports = app;
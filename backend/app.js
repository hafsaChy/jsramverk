import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
// import multer from 'multer';
import path from 'path';
import bodyParser from 'body-parser';
// import { graphqlHTTP } from 'express-graphql';
// import schema from './graphql/index.js';
import authModel from './models/auth.js';  // For authentication
import trainsModel from './models/trains.js';
import editTicket from './models/edits.js';
import delayed from './routes/delayed.js';
import tickets from './routes/tickets.js';
import codes from './routes/codes.js';
import auth from './routes/auth.js';
// import edits from './routes/edits.js';
import trains from './routes/trains.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
// import database from '../db/database.js';
// const bcrypt = require('bcryptjs');
import bcrypt from 'bcryptjs';
// const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken';

// const jwtSecret = process.env.JWT_SECRET;
// const saltRounds = 10;

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

const io = new Server (httpServer, {
  cors: {
    origin: 'http://localhost:3000',
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

app.use("/", (req, res, next) => {
  try {
    if (req.path == "/login" || req.path == "/register" || req.path == "/") {
      next();
    } else {
      /* decode jwt token if authorized*/
      jwt.verify(req.headers.token, 'shhhhh11111', function (err, decoded) {
        if (decoded && decoded.user) {
          req.user = decoded;
          next();
        } else {
          return res.status(401).json({
            errorMessage: 'User unauthorized!',
            status: false
          });
        }
      })
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
})

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    title: 'Apis'
  });
});

/* login api */
app.post("/login", (req, res) => {
  try {
    if (req.body && req.body.username && req.body.password) {
      user.find({ username: req.body.username }, (err, data) => {
        if (data.length > 0) {

          if (bcrypt.compareSync(data[0].password, req.body.password)) {
            checkUserAndGenerateToken(data[0], req, res);
          } else {

            res.status(400).json({
              errorMessage: 'Username or password is incorrect!',
              status: false
            });
          }

        } else {
          res.status(400).json({
            errorMessage: 'Username or password is incorrect!',
            status: false
          });
        }
      })
    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }

});

/* register api */
app.post("/register", (req, res) => {
  try {
    if (req.body && req.body.username && req.body.password) {

      user.find({ username: req.body.username }, (err, data) => {

        if (data.length == 0) {

          let User = new authModel.getUsers({
            username: req.body.username,
            password: req.body.password
          });
          User.save((err, data) => {
            if (err) {
              res.status(400).json({
                errorMessage: err,
                status: false
              });
            } else {
              res.status(200).json({
                status: true,
                title: 'Registered Successfully.'
              });
            }
          });

        } else {
          res.status(400).json({
            errorMessage: `UserName ${req.body.username} Already Exist!`,
            status: false
          });
        }

      });

    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

function checkUserAndGenerateToken(data, req, res) {
  jwt.sign({ user: data.username, id: data._id }, 'shhhhh11111', { expiresIn: '1d' }, (err, token) => {
    if (err) {
      res.status(400).json({
        status: false,
        errorMessage: err,
      });
    } else {
      res.json({
        message: 'Login Successfully.',
        token: token,
        status: true
      });
    }
  });
}

// app.use('/auth', authModel.checkToken); // authentication middleware
// GraphQL
// const visual = false;

// app.use('/graphql', authModel.checkToken); // authentication middleware
// app.all('/graphql', graphqlHTTP((req) => ({ // Route
//     schema: schema,
//     graphiql: visual,
//     context: { req } // Needed in mutation for checking if authenticated
// })));

app.use('/delayed', delayed);
app.use('/tickets', tickets);
app.use('/codes', codes);
app.use('/trains', trains);
app.use('/auth', auth);
// app.use('/edits', edits);

// Start server
httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Used for moving trains
trainsModel.fetchTrainPositions(io);
editTicket(io);

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

// Export httpServer so it can be used for testing
export default httpServer;

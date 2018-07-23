const Promise = require('bluebird');
const mongoose = require('mongoose');
const config = require('./config');
const models = require('./models');
let limit = 2;
let error = 0;
let disconnection = 0;

mongoose.set('debug', true);

mongoose.Promise = Promise;

/**
 * Create the database connection
 */
module.exports = () => {
  models();
  return connect();
};

const connect = () => {
  return mongoose.connect(config.parsed.MONGO_CONNECT, {
    poolSize: 20,
    reconnectTries: Number.MAX_VALUE
  });
};

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', () => {
  const connection = mongoose.connections[0];
  console.log('Mongoose default connection opened', connection.name);
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
  console.log('Mongoose default connection error: ', err);
  error += 1;
  if (error < limit) {
    connect();
  }
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
  console.log('disconnected-------------', disconnection);
  disconnection += 1;
  if (disconnection < limit) {
    connect();
  }
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});
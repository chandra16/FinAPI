const Glue = require('glue');
const HapiAuthJWT = require('hapi-auth-jwt2');
const Inert = require('inert');
const Moment = require('moment');
const Config = require('./config');
const Manifest = require('./manifest');
const Logger = require('./server/helper/logger');
const AuthenticationData = require('./server/model/authenticationData');

const options = {
  relativeTo: __dirname
};

if (process.env.NODE_ENV !== 'production') {
  Manifest.register.plugins.push({
    plugin: 'blipp',
    options: {
      showAuth: true
    }
  });
}

const secret = Config.get('/login/secret');
// use the token as the 'authorization' header in requests

// bring your own validation function
const validate = async (decoded, request, h) => {
  Logger.write.log('info', 'decoded', decoded);
  Logger.write.log('info', 'request info', request.info);
  Logger.write.log('info', 'request header user-agent: ' + request.headers['user-agent']);
  const tokenExpirationDate = Moment(decoded.exp * 1000);
  Logger.write.log('info', 'expired date: ' + tokenExpirationDate, decoded);

  // check user_id and email are match with database
  const isValid = await AuthenticationData.checkAuth(decoded.email)
    .then((result) => {
      return (result[0] && result[0].authentication_id) === decoded.authId ? true : false;
    });
  return { isValid: isValid};
};

// Show bad promises
process.on('unhandledRejection', (reason, p) => {
  console.log(p, reason);
  Logger.write.log('error', 'Unhandled Rejection at: ' + JSON.stringify(p), 'reason: ' + JSON.stringify(reason));
});

const startServer = async () => {
  const server = await Glue.compose(
    Manifest,
    options
  );

  await server.register(HapiAuthJWT);

  await server.register(Inert);

  server.auth.strategy('jwt', 'jwt', {
    key: secret,
    validate,
    verifyOptions: {algorithms: ['HS256'], ignoreExpiration: false}
  });

  server.auth.default('jwt');

  await server.start();
};

startServer();

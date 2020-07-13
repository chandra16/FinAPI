const { createLogger, format, transports } = require('winston');
const Fs = require('fs');
const Path = require('path');

const env = process.env.NODE_ENV || 'development';
const logDir = 'log';

// Create the log directory if it does not exist
if (!Fs.existsSync(logDir)) {
  Fs.mkdirSync(logDir);
}

const filename = Path.join(logDir, 'web-api-' + env + '.log');

exports.write = createLogger({
  // change level if in dev environment versus production
  level: env === 'development' ? 'verbose' : 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename })
  ]
});

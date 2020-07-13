const Logger = require('../helper/logger');

exports.plugin = {
    register: () => {
        process.once('uncaughtException', function (err) {
            var formattedErr = {
              message: err.message,
              stack: err.stack
            };

            Logger.write.log('error', JSON.stringify(formattedErr));
            process.exit(1);
        });
    },
    name: 'exection-handler'
};

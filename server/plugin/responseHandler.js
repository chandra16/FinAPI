const _ = require('lodash');
const Logger = require('../helper/logger');

exports.plugin = {
    register: (server) => {
        server.ext('onRequest', (request, h) => {
            request.startTime = process.hrtime();
            return h.continue;
        });

        server.ext('onPreResponse', (request, h) => {
            const response = request.response;
            const timeDiff = process.hrtime(request.startTime);
            const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);

            var logData = {
                url: request.url.path,
                status: response.statusCode,
                timeTaken: timeTaken
              };
            Logger.write.log('info', 'onPreResponse: ' + JSON.stringify(logData));

            // Check if it's an error
            if (_.includes([400, 500], response.statusCode) || _.includes([400, 500], response.output && response.output.statusCode)) {
                //able to add maintenance check (return maintenance response)
                return h.continue;
            }

            return h.continue;
        });
    },
    name: 'response-handler'
};

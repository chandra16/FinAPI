const _ = require('lodash');
const Boom = require('boom');
const EmailHelper = require('../helper/emailHelper');
const Logger = require('./../helper/logger');

const emailHandler = async (req, type, h) => {
    try {
        const emailResponse = await EmailHelper.sendEmail(req, type);
        Logger.write.log('info', 'Email handler : ' + h.response(emailResponse));
        return h.response(emailResponse);
    } catch (err) {
        throw Boom.badRequest(err.message);
    }
};

const emailVerificationHandler = async (request, h) => {
    const req = request.payload;
    try {
        const emailResponse = await EmailHelper.sendEmail(req, 'verification');
        return h.response(emailResponse);
    } catch (err) {
        throw Boom.badRequest(err.message);
    }
};

exports.plugin = {
    register: (server, options) => {
        options = _.extend({ basePath: '' }, options);
        server.route([{
            method: 'POST',
            path: options.basePath + '/',
            handler: emailHandler,
            options: {
                description: 'Send email',
                tags: ['api'],
                auth: false
            }
        }, {
          method: 'POST',
          path: options.basePath + '/verification',
          handler: emailVerificationHandler,
          options: {
              description: 'Send email verification',
              tags: ['api'],
              auth: false
          }
        }]);
    },

    'name' : 'api-email'
};

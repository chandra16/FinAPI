const Config = require('./config');
const Confidence = require('confidence');

const criteria = {
    env: process.env.NODE_ENV
};

const manifest = {
    server: {
        port: Config.get('/port/api'),
        routes: {
            cors: true,
            security: true
        }
    },
    register: {
        plugins: [
            { plugin: 'inert' },
            { plugin: 'vision' },
            {
                plugin: 'good',
                options: Config.get('/logging')
            },
            { plugin: './server/api/auth', routes: { prefix: '/api/auth' } },
            { plugin: './server/api/borrower', routes: { prefix: '/api/borrower' } },
            { plugin: './server/api/investor', routes: { prefix: '/api/investor' } },
            { plugin: './server/api/utils', routes: { prefix: '/api/utils' } },
            { plugin: './server/api/form', routes: { prefix: '/api/form' } },
            { plugin: './server/api/email', routes: { prefix: '/api/email' } },
            { plugin: './server/api/admin', routes: { prefix: '/api/admin' } },
            { plugin: './server/api/accounting', routes: { prefix: '/api/accounting' } },
            { plugin: './server/api/file', routes: { prefix: '/api/file' } },
            { plugin: './server/api/loan', routes: { prefix: '/api/loan' } },
            { plugin: './server/api/rating', routes: { prefix: '/api/rating' } },
            { plugin: './server/api/asset', routes: { prefix: '/api/asset' } },
            { plugin: './server/api/funding', routes: { prefix: '/api/funding' } },
            { plugin: './server/api/kyc', routes: { prefix: '/api/kyc' } },
            { plugin: './server/api/installment', routes: { prefix: '/api/installment' } },
            { plugin: './server/api/reporting', routes: { prefix: '/api/reporting' } },
            { plugin: './server/plugin/exceptionHandler', routes: {} },
            { plugin: './server/plugin/responseHandler', routes: {} }
        ]
    }
};

module.exports = manifest;

var store = new Confidence.Store(manifest);

exports.get = function (key) {
    return store.get(key, criteria);
};

exports.meta = function (key) {
    return store.meta(key, criteria);
};

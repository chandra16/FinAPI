const Connect = require('../service/dbPool');
const Moment = require('moment');

const formatString = function (string) {
    return '\'' + string + '\'';
};

const insertDataDigisign = function (userCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_digisign (user_code) VALUES ('
            + formatString(userCode)
           + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateRegistrationStatus = function (userCode, status) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('UPDATE tbl_digisign SET '
            + 'status_registration = ' + status
            + ' WHERE user_code = ' + formatString(userCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateInvestorPksStatus = function (userCode, status) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('UPDATE tbl_digisign SET '
            + 'status_investorpks = ' + status
            + ' WHERE user_code = ' + formatString(userCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getStatusRegistration = (userCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT status_registration FROM tbl_digisign'
            + ' WHERE user_code = ' + formatString(userCode) + ';');

        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getStatusInvestor = (userCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT status_investorpks FROM tbl_digisign'
            + ' WHERE user_code = ' + formatString(userCode) + ';');

        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertRecordDigisign = function (userCode, type, resVal) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_response_digisign (source, type, response, receive_date) VALUES ('
            + formatString(userCode) + ', ' + formatString(type) + ', ' + formatString(resVal) + ', CURRENT_TIMESTAMP'
           + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

module.exports = {
    getStatusInvestor,
    getStatusRegistration,
    insertDataDigisign,
    insertRecordDigisign,
    updateInvestorPksStatus,
    updateRegistrationStatus
};

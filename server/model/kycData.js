const Connect = require('../service/dbPool');
const Moment = require('moment');

const formatString = function (string) {
    return '\'' + string + '\'';
};

const updateOcr = function (id, idNumber, name, dob, pob) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_kyc_ocr (id, id_number, name, date_of_birth, place_of_birth) VALUES ('
            + formatString(id) + ', '
            + formatString(idNumber) + ', '
            + formatString(name) + ', '
            + formatString(dob) + ', '
            + formatString(pob)
           + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateKycValidation = function (userCode, columnName, id) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('UPDATE tbl_kyc_validation SET '
            + columnName + ' = ' + formatString(id)
            + ' WHERE user_code = ' + formatString(userCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const createKycValidation = function(userCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_kyc_validation (user_code) VALUES ('
            + formatString(userCode) + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const createKycDetail = function (id, status, info) {
    let connectionContext;
    const time = Moment().format().split('+');
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_kyc_validation_detail (id_transaction, status, info, created_at) VALUES ('
            + formatString(id) + ', '
            + formatString(status) +  ', '
            + formatString(info) + ', '
            + formatString(time[0].replace(/T/, ' ').replace(/\..+/, '')) + ');');

        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateBankAccValidator = function (id, status, info, updatedAt) {
    let connectionContext;
    const time = Moment().format().split('+');
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('UPDATE tbl_kyc_validation_detail SET'
            + ' status = ' + formatString(status) + ','
            + ' info = ' + formatString(info) + ','
            + ' updated_at = ' + formatString(updatedAt.replace(/T/, ' ').replace(/\..+/, ''))
            + 'WHERE id_transaction=' + formatString(id) + ';');

        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getDataKycDetail = (userCode, type) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('Select detail.status, detail.info from tbl_kyc_validation_detail detail JOIN tbl_kyc_validation kyc ON detail.id_transaction = '
            + 'kyc.' + type + ' WHERE kyc.user_code = '
            + formatString(userCode) + ';');

        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getKycOcrDetail = function(userCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('select ocr.id_number, ocr.name, ocr.date_of_birth, ocr.place_of_birth from tbl_kyc_ocr ocr JOIN tbl_kyc_validation kyc ON ocr.id = kyc.id_card_ocr_validation'
            + ' WHERE kyc.user_code = ' + formatString(userCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

module.exports = {
    updateOcr,
    updateKycValidation,
    createKycDetail,
    updateBankAccValidator,
    createKycValidation,
    getDataKycDetail,
    getKycOcrDetail
};

const Connect = require('../service/dbPool');

const formatString = function (string) {
    return '\'' + string + '\'';
};

const insertOtp = function (authId, otp, type, msisdn, date) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
        connectionContext =  connection;
        return connection.query('INSERT INTO tbl_otp (auth_id, msisdn, otp, type, created_at, expired_at ) VALUES ('
            + authId + ','
            + formatString(msisdn) + ','
            + formatString(otp) + ','
            + type + ','
            + 'CURRENT_TIMESTAMP' + ','
            + 'date_add(current_timestamp, interval +30 minute)'
            // + formatString(date.toJSON().slice(0, 19).replace('T', ' ')) + ','
            // + formatString(new Date(date.setMinutes(date.getMinutes() + 10)).toJSON().slice(0, 19).replace('T', ' '))
            + ');');
    })
        .then(function (results) {
        connectionContext.release();
        return Promise.resolve(results);
    });
};

const getOtpOld = (authId, noHp) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT otp FROM tbl_otp '
                + 'WHERE auth_id=' + authId + ' AND msisdn=' + noHp + ' ORDER BY expired_at desc;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getOtp = (authId, noHp, type) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT otp FROM tbl_otp '
                + 'WHERE auth_id=' + authId + ' AND msisdn=' + noHp + ' AND type=' + type
                + ' AND CURRENT_TIMESTAMP BETWEEN created_at AND expired_at ORDER BY expired_at desc;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertEmailToken = function (authId, email, token, date) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
        connectionContext =  connection;
        return connection.query('INSERT INTO tbl_verify (auth_id, email, token, send_at, expired_at ) VALUES ('
            + authId + ','
            + formatString(email) + ','
            + formatString(token) + ','
            + formatString(date.toJSON().slice(0, 19).replace('T', ' ')) + ','
            + formatString(new Date(date.setMinutes(date.getMinutes() + 30)).toJSON().slice(0, 19).replace('T', ' '))
            + ');');
    })
        .then(function (results) {
        connectionContext.release();
        return Promise.resolve(results);
    });
};

const getEmailToken = (token) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT email, auth_id FROM tbl_verify '
                + 'WHERE token=' + formatString(token) + ' ORDER BY expired_at desc;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const checkOtpCount = (msisdn, type) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            console.log('nomor hp' + msisdn);
            console.log('type' + type);
            return connection.query('SELECT count(*) as ' + formatString('count') + ' FROM tbl_otp WHERE msisdn = ' + formatString(msisdn)
                + 'and type = ' + type + ' AND created_at BETWEEN CURRENT_TIMESTAMP - INTERVAL 20 MINUTE AND CURRENT_TIMESTAMP;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

module.exports = {
    checkOtpCount,
    getEmailToken,
    getOtp,
    insertEmailToken,
    insertOtp
};

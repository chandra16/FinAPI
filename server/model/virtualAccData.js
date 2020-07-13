const Connect = require('../service/dbPool');

const formatString = function (string) {
    return '\'' + string + '\'';
};

const insertVirtualData = (userCode, loanCode, virtualAcc, amount, trxId, status, descText) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_va_txn (user_code, loan_code, virtual_account, amount, transaction_id, status, description, created_date) '
                + 'VALUES (' + formatString(userCode) + ', ' + formatString(loanCode) + ', ' + formatString(virtualAcc) + ', ' + amount + ', '
                + formatString(trxId) + ', ' + status + ', ' + formatString(descText) + ', ' + formatString(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertVirtualDataBrw = (userCode, loanCode, virtualAcc, amount, trxId, status, descText) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_va_borrower (user_code, loan_code, virtual_account, amount, transaction_id, status, description, created_date) '
                + 'VALUES (' + formatString(userCode) + ', ' + formatString(loanCode) + ', ' + formatString(virtualAcc) + ', ' + amount + ', '
                + formatString(trxId) + ', ' + status + ', ' + formatString(descText) + ', ' + formatString(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updatePayment = (virtualAcc, trxId, status, paymentId, paymentDate) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('UPDATE tbl_va_txn SET status = ' + status + ', payment_ntb = ' + formatString(paymentId)
                + ', payment_date = ' + formatString(paymentDate) + ' WHERE transaction_id = ' + formatString(trxId)
                + ' AND virtual_account = ' + formatString(virtualAcc) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updatePaymentBrw = (virtualAcc, trxId, status, paymentId, paymentDate) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('UPDATE tbl_va_borrower SET status = ' + status + ', payment_ntb = ' + formatString(paymentId)
                + ', payment_date = ' + formatString(paymentDate) + ' WHERE transaction_id = ' + formatString(trxId)
                + ' AND virtual_account = ' + formatString(virtualAcc) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getRoleTrx = (trxId) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT '
                + '(SELECT id FROM tbl_va_borrower WHERE transaction_id = ' + formatString(trxId) + ') as ' + formatString('borrower') + ', '
                + '(SELECT id FROM tbl_va_txn WHERE transaction_id = ' + formatString(trxId) + ') as ' + formatString('investor') + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

module.exports = {
    getRoleTrx,
    insertVirtualData,
    insertVirtualDataBrw,
    updatePayment,
    updatePaymentBrw
};

const Connect = require('../service/dbPool');

const formatString = function (string) {
    return '\'' + string + '\'';
};

const insertDocumentData = (userCode, name, docType, docName, email, docNo, remark) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_document (user_code, name, document_type, document_no, document_name, email, remark, created_date) '
                + 'VALUES (' + formatString(userCode) + ', ' + formatString(name) + ', ' + formatString(docType) + ', ' + formatString(docNo) + ', ' + formatString(docName) + ', '
                + formatString(email) + ', ' + formatString(remark) + ', ' + formatString(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getAllDocument = (docType) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT name, email, document_type, document_name, document_no, created_date, remark FROM tbl_document WHERE document_type = '
                + formatString(docType) + 'ORDER BY created_date DESC;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getAllFunderDocument = (loanCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT document.document_no, document.created_date '
                + 'FROM tbl_funding_detail fdetail '
                + 'LEFT JOIN tbl_funding funding '
                + 'ON fdetail.funding_id = funding.id '
                + 'LEFT JOIN tbl_document document '
                + 'ON fdetail.user_code = document.user_code '
                + 'WHERE funding.loan_code = ' + formatString(loanCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getDocumentNoForFunding = (userCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT document.document_no '
                + 'FROM tbl_document document '
                + 'WHERE document.user_code = ' + formatString(userCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getDocumentNoForLoan = (userCode, loanCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT document.document_no '
                + 'FROM tbl_document document '
                + 'WHERE document.user_code = ' + formatString(userCode)
                + ' AND document.remark =' + formatString(loanCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

module.exports = {
    insertDocumentData,
    getAllDocument,
    getAllFunderDocument,
    getDocumentNoForFunding,
    getDocumentNoForLoan
};

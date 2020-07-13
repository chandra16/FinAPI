const Connect = require('../service/dbPool');
const Moment = require('moment');

const formatString = function (string) {
    return '\'' + string + '\'';
};

const insertDividen = (loanCode, userCode, amount, plan) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_dividen (loan_code, user_code, amount, plan, updated_date) '
                + 'VALUES (' + formatString(loanCode) + ', ' + formatString(userCode) + ', ' + amount + ', '
                + plan + ', ' + formatString(Moment().format()) + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertDividenInvestor = (loanCode, userCode, serviceFee, totalInterest, amount, plan) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'INSERT INTO tbl_dividen (loan_code, user_code, service_fee, total_interest, amount, plan, updated_date) '
                + 'VALUES ('
                + formatString(loanCode) + ', '
                + formatString(userCode) + ', '
                + serviceFee + ', '
                + totalInterest + ', '
                + amount + ', '
                + plan + ', '
                + formatString(Moment().format()) + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getInterestRate = (loanCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT loan.lama_tenor, bunga.bunga, bunga.service_fee FROM tbl_request_loans loan, tbl_master_rating mrating, '
                + 'tbl_bunga bunga where loan.grade = mrating.rating AND bunga.rating_id = mrating.id AND bunga.tenor_id = loan.lama_tenor '
                + 'AND loan.loan_code = ' + formatString(loanCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getDividen = (userCode, loanCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT loan_code, user_code, SUM(amount) amount, plan, updated_date FROM tbl_dividen '
                + 'WHERE user_code = ' + formatString(userCode) + ' AND loan_code = ' + formatString(loanCode) + ' GROUP BY loan_code, plan;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateDividen = (status, loanCode, plan) => {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('UPDATE tbl_dividen SET status = ' + status
                + ' , updated_date = ' + formatString(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''))
                + ' WHERE loan_code = ' + formatString(loanCode) + ' AND plan = ' + plan + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

module.exports = {
    getDividen,
    getInterestRate,
    insertDividenInvestor,
    insertDividen,
    updateDividen
};

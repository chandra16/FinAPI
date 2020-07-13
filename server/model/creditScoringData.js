const Connect = require('../service/dbPool');

const formatString = function (string) {
    return '\'' + string + '\'';
};

const addCreditScoringWeight = function (type, variableId, weight, userCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
        connectionContext =  connection;
        return connection.query('insert into tbl_credit_scoring_weight(loan_type, variable_id, weight, status, created_by, created_dt)'
        + 'Values(' + formatString(type) + ', ' + variableId + ', ' + weight + ', 1, ' + formatString(userCode) + ', ' + formatString(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + ')');
    })
        .then(function (results) {
        connectionContext.release();
        return Promise.resolve(results);
    });
};

const addCreditScoring = function (type, ratingId, minValue, userCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
        connectionContext =  connection;
        return connection.query('insert into tbl_credit_scoring(loan_type, rating_id, min, status, created_by, created_dt)'
        + 'Values(' + formatString(type) + ', ' + ratingId + ', ' + minValue + ', 1, ' + formatString(userCode) + ', ' + formatString(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + ')');
    })
        .then(function (results) {
        connectionContext.release();
        return Promise.resolve(results);
    });
};

const getCreditScoringWeight = function (type, id) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
        connectionContext =  connection;
        return connection.query('select w.id, w.loan_type, w.variable_id, w.weight, s.item ' +
        ' from tbl_credit_scoring_weight  w join tbl_system_variable s on s.id = w.variable_id where w.loan_type = '
        + formatString(type) + ' and w.status=1 and s.name =  '
        + formatString('SCORING') + (id > 0 ? ' and w.id=' + id : '') + ' order by w.weight desc');
    })
        .then(function (results) {
        connectionContext.release();
        return Promise.resolve(results);
    });
};

const getCreditScoring = function (type, id) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
        connectionContext =  connection;
        return connection.query('select w.id, w.loan_type, w.rating_id, w.min, s.rating ' +
        ' from tbl_credit_scoring w join tbl_master_rating s on s.id = w.rating_id where w.loan_type = '
        + formatString(type) + ' and w.status=1 '
        + (id > 0 ? ' and w.id=' + id : '') + ' order by w.min desc');
    })
        .then(function (results) {
        connectionContext.release();
        return Promise.resolve(results);
    });
};

const updateCreditScoringWeight = function (id, weight, userCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
        connectionContext =  connection;
        return connection.query('update tbl_credit_scoring_weight set weight=' + weight
        + ', updated_by=' + formatString(userCode)
        + ', updated_dt=' + formatString(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''))
        + ' where id=' + id);
    })
        .then(function (results) {
        connectionContext.release();
        return Promise.resolve(results);
    });
};

const updateCreditScoring = function (id, ratingId, minValue, userCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
        connectionContext =  connection;
        return connection.query('update tbl_credit_scoring set min=' + minValue
        + ', rating_id=' + ratingId
        + ', updated_by=' + formatString(userCode)
        + ', updated_dt=' + formatString(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''))
        + ' where id=' + id);
    })
        .then(function (results) {
        connectionContext.release();
        return Promise.resolve(results);
    });
};

const disableCreditScoringWeight = function (id, userCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
        connectionContext =  connection;
        return connection.query('update tbl_credit_scoring_weight set status=2'
        + ', updated_by=' + userCode
        + ', updated_dt=' + formatString(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''))
        + ' where id=' + id);
    })
        .then(function (results) {
        connectionContext.release();
        return Promise.resolve(results);
    });
};

const disableCreditScoring = function (id, userCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
        connectionContext =  connection;
        return connection.query('update tbl_credit_scoring set status=2'
        + ', updated_by=' + userCode
        + ', updated_dt=' + formatString(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''))
        + ' where id=' + id);
    })
        .then(function (results) {
        connectionContext.release();
        return Promise.resolve(results);
    });
};

module.exports = {
    addCreditScoringWeight,
    getCreditScoringWeight,
    updateCreditScoringWeight,
    disableCreditScoringWeight,
    addCreditScoring,
    getCreditScoring,
    updateCreditScoring,
    disableCreditScoring
};

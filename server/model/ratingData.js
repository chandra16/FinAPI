const Connect = require('../service/dbPool');

const getRatingList = function () {
    let connectionContext;
    return Connect()
        .then(function (connection) {
        connectionContext =  connection;
        return connection.query('select * from tbl_master_rating order by id asc');
    })
        .then(function (results) {
        connectionContext.release();
        return Promise.resolve(results);
    });
};

const addBessRating = function (maks, min, ratingId, userId) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
        connectionContext =  connection;
        return connection.query('insert into tbl_bess_rating(maks, min, rating_id,status, updated_by, updated_dt)'
        + 'Values(' + maks + ', ' + min + ', ' + ratingId + ', 1, ' + userId + ', ' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ')');
    })
        .then(function (results) {
        connectionContext.release();
        return Promise.resolve(results);
    });
};

const getBessRating = function () {
    let connectionContext;
    return Connect()
        .then(function (connection) {
        connectionContext =  connection;
        return connection.query('select br.id, br.maks, br.min, r.rating from tbl_bess_rating br, ' +
        ' tbl_master_rating r where br.rating_id = r.id and br.status=1 order by br.rating_id asc');
    })
        .then(function (results) {
        connectionContext.release();
        return Promise.resolve(results);
    });
};

const updateBessRating = function (ratingId, maks, min, rating, userId) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
        connectionContext =  connection;
        return connection.query('update tbl_bess_rating r set r.maks=' + maks
        + ', r.min=' + min + ', rating_id=' + rating + ', updated_by=' + userId
        + ', updated_dt=' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
        + ' where id=' + ratingId);
    })
        .then(function (results) {
        connectionContext.release();
        return Promise.resolve(results);
    });
};

const disableBessRating = function (ratingId, userId) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
        connectionContext =  connection;
        return connection.query('update tbl_bess_rating r set r.status=2'
        + ', updated_by=' + userId
        + ', updated_dt=' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
        + ' where id=' + ratingId);
    })
        .then(function (results) {
        connectionContext.release();
        return Promise.resolve(results);
    });
};

module.exports = {
    addBessRating,
    getBessRating,
    updateBessRating,
    disableBessRating,
    getRatingList
};

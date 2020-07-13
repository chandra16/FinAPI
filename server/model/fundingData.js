const Connect = require('../service/dbPool');

const formatLike = function (string) {
    return '\'' + string + '\%\'';
};

const formatString = function (string) {
    return '\'' + string + '\'';
};

const getFundingByLoan = function (loanCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('select f.id, l.loan_code, f.total_funding, f.status_funding '
                + ' from tbl_funding f join tbl_request_loans l on l.loan_code=f.loan_code and l.loan_code= '
                + formatString(loanCode));
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getFundingDetails = function (fundingId) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getAllFundingList = function (userCode, status) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            let stringQ = 'select id, funding_id, user_code, funding, updated_dt from tbl_funding_detail where status=' + status;
            if (userCode !== '0') {
                stringQ = stringQ + ' and user_code = ' + formatString(userCode);
            }

            return connection.query(stringQ);
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertFunding = function (loanCode, totalFunding, status, userCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_funding (loan_code, total_funding, status_funding, created_by, created_dt, updated_by, updated_dt) '
                + 'VALUES (' + formatString(loanCode) + ', ' + totalFunding + ', ' + status + ', ' + formatString(userCode) + ', ' + formatString(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''))
                + ', ' + formatString(userCode) + ', ' + formatString(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertFundingDetails = function (fundingId, userCode, funding, status) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_funding_detail (funding_id, user_code, funding, status, created_by, created_dt, updated_by, updated_dt) '
                + 'VALUES (' + fundingId + ', ' + formatString(userCode) + ', ' + funding + ', ' + status + ', ' + formatString(userCode) + ', ' + formatString(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + ', '
                + formatString(userCode) + ', ' + formatString(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateFundingAmount = (fundingId, fundingAmount, userCode) => {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('UPDATE tbl_funding SET total_funding = total_funding + ' + fundingAmount + ' , updated_by = ' + formatString(userCode)
                + ' , updated_dt = ' + formatString(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + ' WHERE id = ' + fundingId + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateFundingStatus = (loanCode, status) => {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('UPDATE tbl_funding SET status_funding = ' + status
                + ' , updated_dt = ' + formatString(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + ' WHERE loan_code = ' + formatString(loanCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getCollectionFunding = function (loanCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT funding.total_funding FROM tbl_funding funding WHERE funding.loan_code = ' + formatString(loanCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getInvestorFunding = function (loanCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT funding.id, fdetail.user_code, fdetail.funding FROM tbl_funding funding, tbl_funding_detail fdetail WHERE funding.id = fdetail.funding_id '
                + 'AND funding.loan_code = ' + formatString(loanCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getFundingListByInvestor = function (userCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' tfd.funding_id,'
                + ' tf.loan_code,'
                + ' tfd.user_code,'
                + ' (tu.nama) name,'
                + ' (tlt.loan_type_name) loan_type,'
                + ' trl.lama_tenor,'
                + ' tli.total_interest,'
                + ' tli.collection_interest,'
                + ' SUM(tfd.funding) amount,'
                + ' tf.status_funding,'
                + ' trl.tujuan,'
                + ' tfd.updated_dt '
                + 'FROM tbl_request_loans trl '
                + 'JOIN tbl_loan_interest tli ON trl.loan_code = tli.loan_code '
                + 'JOIN tbl_loan_type tlt ON trl.id_loan_type = tlt.loan_type_id '
                + 'JOIN tbl_users tu ON trl.user_code = tu.user_code '
                + 'LEFT JOIN tbl_funding tf ON trl.loan_code = tf.loan_code '
                + 'LEFT JOIN tbl_funding_detail tfd ON tfd.funding_id = tf.id '
                + 'WHERE tfd.user_code = ' + formatString(userCode) + ' '
                + 'GROUP BY tfd.funding_id;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getDetailLoanPerMonth = function (loanCode, userCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' plan, service_fee, total_interest, amount, updated_date, payment_amount, payment_date, status '
                + 'FROM tbl_dividen '
                + 'WHERE loan_code = ' + formatString(loanCode) + ' '
                + 'AND user_code = ' + formatString(userCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getListFunding = (loanCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' fdetail.user_code, SUM(fdetail.funding) funding, fdetail.status, asset.account_id, asset.virtual_acc, linterest.total_interest, linterest.collection_interest, reqloans.lama_tenor '
                + 'FROM tbl_funding funding '
                + 'JOIN tbl_funding_detail fdetail ON funding.id = fdetail.funding_id '
                + 'JOIN tbl_assets asset ON asset.user_code = fdetail.user_code '
                + 'JOIN tbl_loan_interest linterest ON linterest.loan_code = funding.loan_code '
                + 'JOIN tbl_request_loans reqloans ON reqloans.loan_code = funding.loan_code '
                + 'WHERE funding.loan_code = ' + formatString(loanCode) + ' '
                + 'AND fdetail.status = 1 '
                + 'GROUP BY fdetail.user_code;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getListRequestWithdrawRDL = (status) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT DISTINCT'
                + ' twr.id, twr.user_code, tu.nama, twr.account_no, twr.amount, twr.description, twr.transaction_at '
                + 'FROM tbl_withdraw_rdl twr '
                + 'JOIN tbl_users tu ON twr.user_code = tu.user_code '
                + 'WHERE status = ' + status + ' '
                + 'GROUP BY transaction_at;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateAdminFee = (adminFee, loanCode) => {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('UPDATE tbl_funding SET admin_fee = ' + adminFee
                + ' WHERE loan_code = ' + formatString(loanCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateFundingDetailStatus = (status, userCode, borrowerCode, remark) => {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('UPDATE tbl_funding_detail SET status = ' + status + ' , updated_by = ' + formatString(borrowerCode)
                + ' , remark = ' + formatString(remark)
                + ' , updated_dt = ' + formatString(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + ' WHERE user_code = ' + userCode + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

module.exports = {
    getAllFundingList,
    getCollectionFunding,
    getFundingByLoan,
    getFundingDetails,
    getFundingListByInvestor,
    getListRequestWithdrawRDL,
    getInvestorFunding,
    getListFunding,
    getDetailLoanPerMonth,
    insertFunding,
    insertFundingDetails,
    updateAdminFee,
    updateFundingAmount,
    updateFundingDetailStatus,
    updateFundingStatus
};

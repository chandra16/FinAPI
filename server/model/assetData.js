const Connect = require('../service/dbPool');
const Moment = require('moment');

const formatString = (string) => {
    return '\'' + string + '\'';
};

// Assets
const insertAssetData = (userCode, virtualAcc, accountId, roleId) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_assets (user_code, virtual_acc, account_id, role_id, updated_at) '
                + 'VALUES (' + formatString(userCode) + ', ' + formatString(virtualAcc) + ', ' + formatString(accountId) + ', '
                + roleId + ', ' + formatString(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getCurrBalance = (accountId) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT user_code, balance, role_id, virtual_acc, loan_code '
                + 'FROM tbl_assets WHERE account_id=' + formatString(accountId) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getAssetData = (userCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT asset.user_code, asset.balance, asset.account_id, asset.role_id, bank.nama_nasabah full_name, user.alamat address, '
                + 'asset.virtual_acc, lbank.kode_bank bank_code, lbank.nama_bank bank_name, bank.nomor_rekening account_no, lbank.clearing_code, lbank.rtgs_code '
                + 'FROM tbl_assets asset '
                + 'LEFT JOIN tbl_users user ON asset.user_code = user.user_code '
                + 'LEFT JOIN tbl_bank bank ON bank.user_id = user.user_id '
                + 'LEFT JOIN tbl_list_bank lbank ON bank.list_bank_id = lbank.id_list_bank '
                + 'WHERE asset.user_code= ' + formatString(userCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getAssetDataByRefCode = (refCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT asset.user_code, asset.balance, asset.account_id, asset.role_id, bank.nama_nasabah full_name, user.alamat address, '
                + 'asset.virtual_acc, lbank.kode_bank bank_code, lbank.nama_bank bank_name, bank.nomor_rekening account_no, lbank.clearing_code, lbank.rtgs_code '
                + 'FROM tbl_assets asset '
                + 'LEFT JOIN tbl_users user ON asset.user_code = user.user_code '
                + 'LEFT JOIN tbl_bank bank ON bank.user_id = user.user_id '
                + 'LEFT JOIN tbl_list_bank lbank ON bank.list_bank_id = lbank.id_list_bank '
                + 'WHERE user.referal_code = ' + formatString(refCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};


const getAssetDataBorrower = (userCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' tu.alamat address,'
                + ' tb.nama_nasabah full_name, tb.nomor_rekening account_no,'
                + ' tlb.kode_bank bank_code, tlb.nama_bank bank_name, tlb.clearing_code, tlb.rtgs_code '
                + 'FROM tbl_users tu '
                + 'LEFT JOIN tbl_bank tb ON tb.user_id = tu.user_id '
                + 'LEFT JOIN tbl_list_bank tlb ON tb.list_bank_id = tlb.id_list_bank '
                + 'WHERE tu.user_code = ' + formatString(userCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateBalance = (accountId, balance) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('UPDATE tbl_assets SET balance = ' + balance + ', updated_at = '
                + formatString(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + ' WHERE virtual_acc = '
                + formatString(accountId) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateBalanceByUserCode = (userCode, amount) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('UPDATE tbl_assets SET balance = balance + ' + amount + ', updated_at = '
                + formatString(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + ' WHERE user_code = '
                + formatString(userCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getTotalAsset = (userCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT virtual_acc, balance '
                + 'FROM tbl_assets WHERE user_code=' + formatString(userCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getAssetInfo = (accountNo) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT user_code, balance FROM tbl_assets '
                + 'WHERE virtual_acc = ' + formatString(accountNo) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateLoanCode = (userCode, loanCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('UPDATE tbl_assets SET loan_code = ' + formatString(loanCode) + ', updated_at = '
                + formatString(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + ' WHERE user_code = '
                + formatString(userCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

// Assets Transaction
const insertDeposit = (userCode, virtualAcc, amount, bankName, txnType, paymentId, txnDate, status, accountId) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_asset_txn (user_code, virtual_acc, amount, bank_name, txn_type, payment_id, transaction_at, status, account_id) '
                + 'VALUES (' + formatString(userCode) + ', ' + formatString(virtualAcc) + ', ' + formatString(amount) + ', '
                + formatString(bankName) + ', ' + txnType + ', ' + formatString(paymentId) + ', '
                + formatString(txnDate.replace(/T/, ' ').replace(/\..+/, '')) + ', ' + status + ', ' + formatString(accountId) + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertAssetTxn = (userCode, virtualAcc, amount, bankName, txnType, journalNo, txnDate, status) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_asset_txn (user_code, virtual_acc, amount, bank_name, txn_type, journal_no, transaction_at, status) '
                + 'VALUES (' + formatString(userCode) + ', ' + formatString(virtualAcc) + ', ' + formatString(amount) + ', '
                + formatString(bankName) + ', ' + formatString(txnType) + ', ' + formatString(journalNo) + ', '
                + formatString(txnDate.replace(/T/, ' ').replace(/\..+/, '')) + ', ' + status + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getAllTransaction = (userCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT virtual_acc, amount, bank_name, txn_type, payment_id, transaction_at '
                + 'FROM tbl_asset_txn WHERE user_code=' + formatString(userCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const checkPaymentId = (paymentId) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT payment_id FROM tbl_asset_txn WHERE payment_id=' + formatString(paymentId) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

//withdraw
const insertDisbursement = (userCode, amount, bankName, txnType, txnDate, status, accountId, accountNo, name, description, disbursementId) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_withdraw_txn (user_code, amount, bank_name, txn_type, transaction_at, status, '
                + 'account_no, name, description, account_id, disbursement_id) '
                + 'VALUES (' + formatString(userCode) + ', ' + formatString(amount) + ', '
                + formatString(bankName) + ', ' + txnType + ', ' + formatString(txnDate.replace(/T/, ' ').replace(/\..+/, '')) + ', '
                + status + ', ' + formatString(accountNo) + ', ' + formatString(name) + ', ' + formatString(description) + ', '
                + formatString(accountId) + ', ' + formatString(disbursementId) + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateWithdrawTranStatus = (userCode, id, status, transDate) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('UPDATE tbl_withdraw_txn SET status = ' + status + ', updated_at = '
                + formatString(transDate.replace(/T/, ' ').replace(/\..+/, '')) + ' WHERE disbursement_id = '
                + formatString(id) + ' AND user_code = ' + formatString(userCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getLoanCodeFromWithdraw = (disbursementId) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT description FROM tbl_withdraw_txn WHERE disbursement_id=' + formatString(disbursementId) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertWithdrawRdl = (userCode, amount, bankName, txnType, txnDate, status, accountNo, name, description, disbursementId) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_withdraw_rdl (user_code, amount, bank_name, txn_type, transaction_at, status, '
                + 'account_no, name, description, disbursement_id) '
                + 'VALUES (' + formatString(userCode) + ', ' + formatString(amount) + ', '
                + formatString(bankName) + ', ' + txnType + ', ' + formatString(txnDate.replace(/T/, ' ').replace(/\..+/, '')) + ', '
                + status + ', ' + formatString(accountNo) + ', ' + formatString(name) + ', ' + formatString(description) + ', '
                + formatString(disbursementId) + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const checkIdDisbursement = (userCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT id, amount, description FROM tbl_withdraw_rdl WHERE user_code = ' + formatString(userCode) + ' AND status = 0;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateWithdrawRdl = (id, journalId, Uuid, status) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('UPDATE tbl_withdraw_rdl SET status = ' + status + ', journal_no = ' + formatString(journalId)
                + ', disbursement_id = ' + formatString(Uuid) + ', updated_at = '
                + formatString(Moment().format()) + ' WHERE id = ' + id + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertGiroTxn = (userCode, virtualAcc, amount, bankName, name, description, accountFrom) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'INSERT INTO tbl_giro_txn'
                + '(user_code, account_no, amount, bank_name, name, description, account_from, status, transaction_at) '
                + 'VALUES '
                + '(' + formatString(userCode) + ', ' + formatString(virtualAcc) + ', ' + amount + ', '
                + formatString(bankName) + ', ' + formatString(name) + ', ' + formatString(description) + ', ' + formatString(accountFrom) + ', ' + 0 + ', ' + formatString(Moment().format()) + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertRecordBni = function (userCode, type, resVal) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_response_bni (source, type, response, receive_date) VALUES ('
            + formatString(userCode) + ', ' + formatString(type) + ', ' + formatString(resVal) + ', CURRENT_TIMESTAMP'
           + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

module.exports = {
    checkIdDisbursement,
    checkPaymentId,
    getAllTransaction,
    getAssetData,
    getAssetDataByRefCode,
    getAssetInfo,
    getCurrBalance,
    getLoanCodeFromWithdraw,
    getTotalAsset,
    getAssetDataBorrower,
    insertAssetData,
    insertAssetTxn,
    insertDeposit,
    insertDisbursement,
    insertGiroTxn,
    insertRecordBni,
    insertWithdrawRdl,
    updateBalance,
    updateLoanCode,
    updateWithdrawTranStatus,
    updateWithdrawRdl,
    updateBalanceByUserCode
};

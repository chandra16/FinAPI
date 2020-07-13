const Connect = require('../service/dbPool');

const formatString = function (string) {
    return '\'' + string + '\'';
};

const insertInstallment = function (loanCode, userCode, amount, plan, dueDate) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_installment (loan_code, user_code, amount, plan, due_date, status) '
                + 'VALUES (' + formatString(loanCode) + ', ' + formatString(userCode) + ', ' + amount + ', '
                + plan + ', ' + formatString(dueDate) + ', ' + 0 + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getAllInstallmentByLoanCode = (loanCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT loan_code, amount, plan, due_date, status, payment_amount, payment_date FROM tbl_installment '
                + 'WHERE loan_code = ' + formatString(loanCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getDisburseInstallmentStatus = function (status) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT installment.id, installment.loan_code, installment.amount, plan.status, installment.due_date, installment.status, installment.payment_amount, installment.payment_date, installment.disburstment_status, installment.disburstment_date'
                + ' FROM tbl_installment installment LEFT JOIN tbl_installment_status plan ON installment.plan = plan.status '
                + 'WHERE installment.status = 1 AND installment.disburstment_status = ' + status + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getAmountLateInterest = function (loanCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('select amount, amount_late_interest, plan from tbl_installment '
                + 'where status > 0 and status < 4 and loan_code = ' + formatString(loanCode) + ' ORDER BY plan desc');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getAmountInstallment = function (loanCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT loan_code, amount, plan, due_date, status, remaining_day FROM tbl_installment'
                + ' WHERE loan_code = ' + formatString(loanCode) + '  AND status = 0 ORDER BY plan asc');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getInvestorIncome = function (loanCode, userCode, plan) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT id, loan_code, user_code, plan, service_fee, total_interest, amount, status FROM tbl_dividen'
                + ' WHERE user_code = ' + formatString(userCode) + ' AND loan_code = ' + formatString(loanCode) + ' AND plan = ' + plan + ' AND status = 0 ORDER BY plan ASC');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateDisburseInstallmentStatus = function (plan, loanCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('UPDATE tbl_installment SET disburstment_status = 1' + ', disburstment_date = ' + formatString(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + ' WHERE loan_code = ' + formatString(loanCode)
                + ' AND plan = ' + plan + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateInstallment = (loanCode, plan, paymentId, amount, status, amountLateInterest) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('UPDATE tbl_installment SET payment_id = ' + formatString(paymentId) + ', status = ' + formatString(status) + ', payment_amount = ' + amount
                + ', payment_date = ' + formatString(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + ', amount_late_interest = ' + amountLateInterest + ' WHERE loan_code = ' + formatString(loanCode)
                + ' AND plan = ' + plan + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getAllInstallmentByUserCode = (userCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT DISTINCT'
                + ' installment.loan_code, reqloan.jumlah_pinjaman, tvb.virtual_account, installment.amount, installment.plan, installment.due_date, installment.status, loantype.loan_type_name,  installment.payment_date, installment.payment_amount, installment.remaining_day '
                + 'FROM tbl_request_loans loan '
                + 'JOIN tbl_installment installment ON installment.loan_code = loan.loan_code '
                + 'JOIN tbl_request_loans reqloan ON reqloan.loan_code = loan.loan_code '
                + 'JOIN tbl_loan_type loantype ON loantype.loan_type_id = loan.id_loan_type '
                + 'JOIN tbl_va_borrower tvb ON tvb.loan_code = loan.loan_code '
                + 'WHERE installment.user_code = ' + formatString(userCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getPendingInstallment = (userCode, status) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT SUM(amount) as total FROM tbl_installment '
                + 'WHERE user_code = ' + formatString(userCode) + ' AND status = ' + status + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getCurrentInstallment = (userCode, status) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT SUM(amount) as total FROM tbl_installment '
                + 'WHERE user_code = ' + formatString(userCode) + ' AND status = ' + status + ' AND MONTH(due_date) = ' + new Date().getMonth() + 1
                + ' AND YEAR(due_date) = ' + new Date().getFullYear() + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getUnpaidInstallment = (amount, userCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT loan_code, amount, plan, due_date, status, remaining_day FROM tbl_installment '
                + 'WHERE user_code = ' + formatString(userCode) + ' AND amount = ' + amount + ' AND status = 0' + ' ORDER BY due_date asc' + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getUnpaidInstallmentByLoanCode = (loanCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' loan_code, amount, amount_late_interest, plan, due_date, status, remaining_day '
                + 'FROM tbl_installment '
                + 'WHERE loan_code = ' + formatString(loanCode) + ' '
                + 'AND status = 0' + ' '
                + 'ORDER BY due_date asc' + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getUserFromVaTransaction = (vaNumber, transactionId) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' user_code, loan_code '
                + 'FROM tbl_va_borrower '
                + 'WHERE transaction_id = ' + transactionId + ' '
                + 'AND virtual_account = ' + vaNumber + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getAllUnpaid = () => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT loan_code, amount, plan, due_date, status FROM tbl_installment WHERE status = 0;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateRemainingDay = (loanCode, plan, remainingDay) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('UPDATE tbl_installment SET remaining_day = ' + remainingDay
                + ' WHERE loan_code = ' + formatString(loanCode) + ' AND plan = ' + plan + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

module.exports = {
    getAllInstallmentByLoanCode,
    getAllInstallmentByUserCode,
    getAllUnpaid,
    getCurrentInstallment,
    getPendingInstallment,
    getUnpaidInstallment,
    getUnpaidInstallmentByLoanCode,
    getUserFromVaTransaction,
    insertInstallment,
    updateInstallment,
    updateRemainingDay,
    getDisburseInstallmentStatus,
    updateDisburseInstallmentStatus,
    getAmountLateInterest,
    getAmountInstallment,
    getInvestorIncome
};

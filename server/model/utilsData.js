const Connect = require('../service/dbPool');
const Moment = require('moment');

const formatLike = function (string) {
    return '\'' + string + '\%\'';
};

const formatString = function (string) {
    return '\'' + string + '\'';
};

const updateToken = function (token) {
    let connectionContext;

    console.log('|================= INSERT DATA TOKEN OF =================|');
    console.log('| token => ', token);
    console.log('|====================== END OF DATA =====================|');
    console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            // return connection.query(''
            //     + 'UPDATE tbl_token '
            //     + 'SET'
            //     + ' token = ' + formatString(token) + ','
            //     + ' expired = (DATE_ADD(now(), INTERVAL 1 HOUR)) '
            //     + 'WHERE id = 1;');
            return connection.query(''
                + 'UPDATE tbl_token '
                + 'SET'
                + ' token = ' + formatString(token) + ','
                + ' created = ' + formatString(Moment().format()) + ','
                + ' expired = ' + formatString(Moment().add(1, 'hours').format()) + ' '
                + 'WHERE id = 1;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getToken = function () {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT '
                + ' token, expired '
                + 'FROM tbl_token '
                + 'WHERE id = 1;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getVariableDashboardDanon = function () {
    let connectionContext;
    return Connect()
    .then(function (connection){
        connectionContext = connection;
        return connection.query(
            'SELECT '
            + '(SELECT COUNT(user_id) FROM tbl_users WHERE is_register = 1 AND approval = 1 AND deleted = 0 AND role_id = 2) AS ' + formatString('jumlah_investor') + ','
            + '(select SUM(jumlah_pinjaman) from `tbl_request_loans` WHERE status_approval>2) as ' + formatString('nilai_dana_pinjaman_tersalurkan') + ','
            + '(select count(jumlah_pinjaman) from `tbl_request_loans` WHERE status_approval>2) as ' + formatString('jumlah_pinjaman_tersalurkan_keseluruhan') + ','
            + '(select COUNT(*) from (select count(loan_code) from tbl_installment WHERE status >= 3 group BY loan_code) as macet) AS ' + formatString('pembayaran_pinjaman_macet_keseluruhan') + ','
            + '(select COUNT(*) from (select count(loan_code) from tbl_installment WHERE DATEDIFF( payment_date,due_date ) >= 90 group BY loan_code) as tkb90) AS ' + formatString('TKB90_keseluruhan') + ','
            + '(select (select SUM(total_interest) from `tbl_loan_interest`)/(select COUNT(loan_code) from tbl_loan_interest)) as ' + formatString('average_interest') + ','
            + '(select count(loan_code) from `tbl_request_loans` WHERE status_approval = 1 AND borrower_approval = 1) as ' + formatString('jumlah_pendanaan_saat_ini') + ','
            + '(select count(*) from tbl_installment t1 inner join (select loan_code, max(plan) as ' + formatString('plan') + ' from tbl_installment group by loan_code) max on t1.loan_code = max.loan_code and t1.plan = max.plan WHERE t1.status BETWEEN 1 and 3) as ' + formatString('jumlah_pinjaman_lunas') + ','
            + '(select SUM(req.jumlah_pinjaman) from `tbl_request_loans` req join (select t1.loan_code from tbl_installment t1 inner join (select loan_code, max(plan) as ' + formatString('plan')
            + ' from tbl_installment group by loan_code) max on t1.loan_code = max.loan_code and t1.plan = max.plan WHERE t1.status BETWEEN 1 and 3) t2 on req.loan_code = t2.loan_code) as ' + formatString('total_nilai_pinjaman_lunas') + ','
            + '(select count(*) from (select count(*), t1.loan_code from tbl_installment t1 inner join (select loan_code, count(loan_code) from tbl_installment where status = 0 GROUP BY loan_code) live on t1.loan_code = live.loan_code'
            + ' where DATEDIFF(t1.payment_date,t1.due_date) > 90 GROUP BY t1.loan_code) tbl) as ' + formatString('jumlah_TKB90_cicilan_masih_berjalan') + ','
            + '(select count(*) from tbl_installment t1 inner join (select loan_code, max(plan) as ' + formatString('plan') + ' from tbl_installment group by loan_code) max on t1.loan_code = max.loan_code and t1.plan = max.plan'
            + ' WHERE t1.status = 0) as ' + formatString('jumlah_cicilan_masih_berjalan')
            + ';'
        );
    })
    .then(function (results) {
        connectionContext.release();
        return Promise.resolve(results);
    });
};

module.exports = {
    updateToken,
    getToken,
    getVariableDashboardDanon
};

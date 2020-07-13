const Connect = require('../service/dbPool');
const Moment = require('moment');

const formatString = function (string) {
    return '\'' + string + '\'';
};

const formatLike = function (string) {
    return '\'' + string + '\%\'';
};

const getAllLoanList = function (status) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            if (status === 1) {
                return connection.query('SELECT loan.loan_code, borrower.nama, loan.id_loan_type, loan.lama_tenor, loan.jumlah_pinjaman, loan.jatuh_tempo, IFNULL(f.total_funding, 0) as total_funding, '
                    + 'loan.tujuan, loan.suku_bunga, loan.project_image, loan.grade FROM tbl_request_loans loan JOIN tbl_users borrower ON borrower.user_code = loan.user_code LEFT JOIN tbl_funding f ON f.loan_code=loan.loan_code WHERE status_approval = ' + status
                    + ' and borrower_approval = 1 and loan.loan_code is not NULL;');
            }

            return connection.query('SELECT loan.loan_code, borrower.nama, loan.id_loan_type, loan.lama_tenor, loan.jumlah_pinjaman, loan.jatuh_tempo, IFNULL(f.total_funding, 0) as total_funding, '
                + 'loan.tujuan, loan.suku_bunga, loan.project_image, loan.grade FROM tbl_request_loans loan JOIN tbl_users borrower ON borrower.user_code = loan.user_code LEFT JOIN tbl_funding f ON f.loan_code=loan.loan_code WHERE status_approval = ' + status
                + ' and loan.loan_code is not NULL;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getNewLoanList = function () {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT loan.loan_code, borrower.nama, loan.id_loan_type, loan.lama_tenor,loan.suku_bunga, loan.jumlah_pinjaman,loan.project_image, loan.jatuh_tempo, IFNULL(f.total_funding, 0) as total_funding, '
                + 'loan.tujuan, loan.grade FROM tbl_request_loans loan JOIN tbl_users borrower ON borrower.user_code = loan.user_code LEFT JOIN tbl_funding f ON f.loan_code=loan.loan_code WHERE status_approval = 1 AND borrower_approval = 1 AND loan.loan_code is not NULL ORDER BY created_at DESC limit 3;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const approveLoan = (loanCode, status, bunga, grade, admin, adminFee, reasonRej) => {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('UPDATE tbl_request_loans SET status_approval = ' + formatString(status) + ', approval_by = ' + formatString(admin) + ', suku_bunga = ' + bunga + ', grade = ' + formatString(grade)
                + ', admin_fee = ' + adminFee + ', approval_at = ' + formatString(Moment().format()) + ', reason_reject = ' + formatString(reasonRej) + ' WHERE loan_code = ' + formatString(loanCode) + ' and loan_code is not NULL;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const approveDisbursement = (loanCode, status, userCode) => {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('UPDATE tbl_request_loans SET status_approval = ' + formatString(status) + ' , approval_by = ' + formatString(userCode)
                + ' , approval_at = ' + formatString(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + ' WHERE loan_code = ' + formatString(loanCode) + ' and loan_code is not NULL;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateInstallmentComplete = (loanCode, status) => {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('UPDATE tbl_request_loans SET status_approval = ' + formatString(status)
                + ' , approval_at = ' + formatString(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + ' WHERE loan_code = ' + formatString(loanCode) + ' and loan_code is not NULL;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getLoanDetail = function (loanCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT borrower.nama, borrower.user_code, loan.loan_code, loan.id_loan_type, loan.lama_tenor, loan.jumlah_pinjaman, loan.total_dana, IFNULL(f.total_funding, 0) as total_funding, '
                + 'loan.total_investor, loan.dokumen1, loan.dokumen2, loan.dokumen3, loan.dokumen4, loan.dokumen5, loan.dokumen6, loan.dokumen7, loan.dokumen8, loan.dokumen9, loan.dokumen10, loan.project_image, loan.jatuh_tempo, loan.suku_bunga, loan.grade, loan.status_approval, loan.tujuan '
                + 'FROM tbl_request_loans loan JOIN tbl_users borrower ON borrower.user_code = loan.user_code LEFT JOIN tbl_funding f ON f.loan_code=loan.loan_code WHERE loan.loan_code is not NULL and loan.loan_code = '
                + formatString(loanCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getInstallmentDetail = function (loanCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT loan.loan_code, loan.id_loan_type, loan.lama_tenor, loan.jumlah_pinjaman, loan.suku_bunga, loan.interest_type, loan.grade, '
                + 'interest.borrower_interest FROM tbl_request_loans loan LEFT JOIN tbl_loan_interest interest ON interest.loan_code = loan.loan_code '
                + 'WHERE loan.loan_code = ' + formatString(loanCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getCollectionMoney = function (userCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT total_dana FROM tbl_request_loans WHERE user_code = ' + formatString(userCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getUserFromLoan = function (loanCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT user_code, jumlah_pinjaman, lama_tenor , status_approval, suku_bunga '
                + 'FROM tbl_request_loans WHERE loan_code = ' + formatString(loanCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertLoan = function (loanCode, userCode, idLoanType, jumlahPinjaman, lamaTenor, sukuBunga, grade, jatuhTempo, tujuan, dokumen1, dokumen2, dokumen3, dokumen4, dokumen5, dokumen6, dokumen7, dokumen8, dokumen9, dokumen10, interestType, fotoProject) {
  let connectionContext;
  return Connect()
      .then(function (connection) {
      connectionContext =  connection;
      return connection.query('INSERT INTO tbl_request_loans (loan_code, user_code, id_loan_type, jumlah_pinjaman, lama_tenor, suku_bunga, grade, jatuh_tempo, tujuan, dokumen1, dokumen2, dokumen3, dokumen4, dokumen5, dokumen6, dokumen7, dokumen8, dokumen9, dokumen10, project_image, interest_type) '
        + 'VALUES (' + formatString(loanCode) + ', ' + formatString(userCode) + ', ' + idLoanType + ', ' + jumlahPinjaman + ', ' + formatString(lamaTenor) + ', ' + formatString(sukuBunga) + ', '
        + formatString(grade) + ', ' + formatString(jatuhTempo.replace(/T/, ' ').replace(/\..+/, '')) + ', ' + formatString(tujuan) + ', ' + formatString(dokumen1) + ', ' + formatString(dokumen2) + ', ' + formatString(dokumen3) + ', '
        + formatString(dokumen4) + ', '  + formatString(dokumen5) + ', ' + formatString(dokumen6) + ', ' + formatString(dokumen7) + ', ' + formatString(dokumen8) + ', ' + formatString(dokumen9) + ', '
        + formatString(dokumen10) + ', '  + formatString(fotoProject) + ', '  + interestType + ');');
  })
      .then(function (results) {
      connectionContext.release();
      return Promise.resolve(results);
  });
};

const insertLoanExternal = function (loanCode, userCode, idLoanType, jumlahPinjaman, lamaTenor, sukuBunga, grade, jatuhTempo, tujuan,
    dokumen1, dokumen2, dokumen3, dokumen4, dokumen5, dokumen6, dokumen7, dokumen8, dokumen9, dokumen10, interestType, fotoProject, productCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
        connectionContext =  connection;
        return connection.query('INSERT INTO tbl_request_loans (loan_code, user_code, id_loan_type, jumlah_pinjaman, lama_tenor, suku_bunga, grade, jatuh_tempo, tujuan, dokumen1, dokumen2, dokumen3, dokumen4, dokumen5, dokumen6, dokumen7, dokumen8, dokumen9, dokumen10, project_image, interest_type, product_code) '
          + 'VALUES (' + formatString(loanCode) + ', ' + formatString(userCode) + ', ' + idLoanType + ', ' + jumlahPinjaman + ', ' + formatString(lamaTenor) + ', ' + formatString(sukuBunga) + ', '
          + formatString(grade) + ', ' + formatString(jatuhTempo.replace(/T/, ' ').replace(/\..+/, '')) + ', ' + formatString(tujuan) + ', ' + formatString(dokumen1) + ', ' + formatString(dokumen2) + ', ' + formatString(dokumen3) + ', '
          + formatString(dokumen4) + ', '  + formatString(dokumen5) + ', ' + formatString(dokumen6) + ', ' + formatString(dokumen7) + ', ' + formatString(dokumen8) + ', ' + formatString(dokumen9) + ', '
          + formatString(dokumen10) + ', '  + formatString(fotoProject) + ', '  + interestType + ', '  + productCode + ');');
    })
        .then(function (results) {
        connectionContext.release();
        return Promise.resolve(results);
    });
  };

const updateLoanDocument = function (idLoan, projectImage, dokumen1, dokumen2, dokumen3, dokumen4, dokumen5, dokumen6, dokumen7, dokumen8, dokumen9, dokumen10) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('UPDATE tbl_request_loans SET project_image = ' + formatString(projectImage) + ', dokumen1 = ' + formatString(dokumen1) + ', dokumen2 = ' + formatString(dokumen2)
                + ', dokumen3 = ' + formatString(dokumen3) + ', dokumen4 = ' + formatString(dokumen4) + ', dokumen5 = ' + formatString(dokumen5)
                + ', dokumen6 = ' + formatString(dokumen6) + ', dokumen7 = ' + formatString(dokumen7) + ', dokumen8 = ' + formatString(dokumen8)
                + ', dokumen9 = ' + formatString(dokumen9) + ', dokumen10 = ' + formatString(dokumen10) + ' where id = ' + idLoan + ' ;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getLatestLoanCode = function (loanCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT loan_code FROM tbl_request_loans WHERE loan_code like ' + formatLike(loanCode) + ' ORDER BY loan_code desc;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getLoanCount = function (userCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT count(*) as count FROM tbl_request_loans WHERE user_code = ' + formatString(userCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getOnProgressLoan = function (userCode, status) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT count(*) as count FROM tbl_request_loans WHERE user_code = ' + formatString(userCode)
                + ' AND status_approval = ' + status + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getDetailProgressLoan = (userCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT'
                + ' loan.loan_code, loan.jumlah_pinjaman, loan.lama_tenor, loan.jatuh_tempo,'
                + ' fund.total_funding, (SELECT COUNT(DISTINCT fdetail.user_code) '
                + 'FROM tbl_funding_detail fdetail WHERE fund.id = fdetail.funding_id) investor_count FROM tbl_request_loans loan, tbl_funding fund '
                + 'WHERE loan.status_approval = 1 AND loan.borrower_approval = 1 AND loan.user_code = ' + formatString(userCode) + ' AND fund.loan_code = loan.loan_code;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getLoanBunga = (lamaTenor, grade) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT bunga, service_fee, borrower_fee FROM tbl_bunga bunga, tbl_master_rating mrating '
                + 'WHERE mrating.id = bunga.rating_id AND mrating.rating = ' + formatString(grade) + ' AND bunga.tenor_id = ' + lamaTenor + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertInterestDetail = (loanCode, totalInterest, netInterest, collectionInterest, borrowerInterest, otherFee) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_loan_interest(loan_code, total_interest, net_interest, collection_interest, borrower_interest, others_fee) '
                + 'VALUES (' + formatString(loanCode) + ', ' + totalInterest + ', ' + netInterest + ', ' + collectionInterest + ', ' + borrowerInterest + ', ' + otherFee + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getBorrowerFee = (loanCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT borrower_interest, others_fee, late_interest FROM tbl_loan_interest '
                + 'WHERE loan_code = ' + formatString(loanCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getDetailAmount = (loanCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT jumlah_pinjaman, admin_fee FROM tbl_request_loans '
                + 'WHERE loan_code = ' + formatString(loanCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getCountLoan = (userCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
        connectionContext =  connection;
        return connection.query('SELECT count(user_code) as loan from tbl_request_loans '
            + 'WHERE user_code = ' + formatString(userCode) + ';');
    })
        .then(function (results) {
        connectionContext.release();
        return Promise.resolve(results);
    });
};

const getVerifiedInvestor = function () {
    let connectionContext;

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'SELECT '
                + 'auth.email, user.nama '
                + 'FROM tbl_users user LEFT JOIN tbl_authentications auth '
                + 'ON user.auth_id = auth.authentication_id '
                + 'WHERE user.is_register = 1 AND user.approval = 1 AND user.deleted = 0 AND user.role_id = 2 ;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getLoanCodeExpire = function (loanCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT loan.loan_code, loan.id_loan_type, loan.lama_tenor, loan.jumlah_pinjaman, loan.suku_bunga, loan.interest_type, loan.grade, '
                + 'interest.borrower_interest FROM tbl_request_loans loan LEFT JOIN tbl_loan_interest interest ON interest.loan_code = loan.loan_code '
                + 'WHERE loan.loan_code = ' + formatString(loanCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertLoanRiskProfile = (idLoan, title, desc) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_loan_risk_profile(id_loan, title, risk_desc) '
                + 'VALUES (' + formatString(idLoan) + ', ' + formatString(title) + ', ' + formatString(desc) + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertPayorInformation = (idLoan, jaminan, payorDesc, industri, klasifikasi, nilaiTagihan) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_payor_information(id_loan, jaminan, payor_desc, industri, klasifikasi, nilai_tagihan) '
                + 'VALUES (' + formatString(idLoan) + ', ' + formatString(jaminan) + ', ' + formatString(payorDesc) + ', ' + formatString(industri) + ', ' + formatString(klasifikasi) + ', ' + formatString(nilaiTagihan) + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};


const getLoanCode = (id) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT loan_code FROM tbl_request_loans '
                + 'WHERE id = ' + id + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updatePayorInfo = (loanCode, payorDesc) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('UPDATE tbl_payor_information SET payor_desc =' + formatString(payorDesc)
            + 'WHERE id_loan = ' + formatString(loanCode) + ';'
            );
        })
        .then(function (results) {
          connectionContext.release();
          return Promise.resolve(results);
        });
};

const updateTujuanLoan = (loanCode, tujuan) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('UPDATE tbl_request_loans SET tujuan =' + formatString(tujuan)
            + 'WHERE loan_code = ' + formatString(loanCode) + ';'
            );
        })
        .then(function (results) {
          connectionContext.release();
          return Promise.resolve(results);
        });
};

const getDataPayor = (loanCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT jaminan, payor_desc, industri, klasifikasi, nilai_tagihan FROM tbl_payor_information '
                + 'WHERE id_loan = ' + formatString(loanCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getDataRisk = (loanCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT title, risk_desc FROM tbl_loan_risk_profile '
                + 'WHERE id_loan = ' + formatString(loanCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getDataBorrower = (loanCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT su.inisial_borrower, pe.perusahaan_nama, pe.informasi_perusahaan, pe.tanggal_berdiri, pe.alamat, sec.name_company_sector '
            + 'FROM tbl_request_loans req JOIN tbl_users su on req.user_code = su.user_code  LEFT JOIN tbl_perusahaan pe ON su.perusahaan_id = pe.perusahaan_id LEFT JOIN tbl_company_sector sec ON  pe.id_sector_perusahaan = sec.id_company_sector '
            + 'where req.loan_code = ' + formatString(loanCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};


const getAllLoanExternal = function (status, productCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT loan.loan_code, borrower.nama, loan.id_loan_type, loan.lama_tenor, loan.jumlah_pinjaman, loan.jatuh_tempo, IFNULL(f.total_funding, 0) as total_funding, '
                + 'loan.tujuan, loan.suku_bunga, loan.project_image, loan.grade FROM tbl_request_loans loan JOIN tbl_users borrower ON borrower.user_code = loan.user_code LEFT JOIN tbl_funding f ON f.loan_code=loan.loan_code WHERE status_approval = ' + status
                + ' and borrower_approval = 1 and loan.loan_code is not NULL;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getExpiredLoan = function () {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT loan.user_code, loan.loan_code, loan.jatuh_tempo, loan.jumlah_pinjaman, funding.total_funding '
                + 'FROM tbl_request_loans loan '
                + 'LEFT JOIN tbl_funding funding '
                + 'ON loan.loan_code = funding.loan_code '
                + 'WHERE loan.status_approval = 1 AND funding.status_funding = 1 '
                + 'AND DATE(loan.jatuh_tempo) = CURDATE();');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertLoanCase = (loanCode, statusLoan, requestedAmount, collectedAmount, userCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_loan_case(loan_code, status_loan,requested_amount, collected_amount, user_code) '
                + 'VALUES (' + formatString(loanCode) + ', ' + statusLoan + ', ' +  requestedAmount + ', ' + collectedAmount
                + ', ' + formatString(userCode) + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getExpiredFunding = function (status, userCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT loan_code, requested_amount, collected_amount FROM tbl_loan_case WHERE status_loan = '
                + status + ' AND user_code = ' + formatString(userCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateStatusLoanCase = function (status, loanCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(' UPDATE tbl_loan_case SET status_loan =' + status
            + ' WHERE loan_code = ' + formatString(loanCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateTotalLoan = function (amount, loanCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(' UPDATE tbl_request_loans SET jumlah_pinjaman =' + amount
            + ' WHERE loan_code = ' + formatString(loanCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateCredibility = function (loanCode, credibility) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(' UPDATE tbl_request_loans SET credibility =' + credibility
            + ' WHERE loan_code = ' + formatString(loanCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateStatusDisburse = function (status, loanCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(' UPDATE tbl_request_loans SET status_disburse =' + status + ', disburse_at = CURRENT_TIMESTAMP'
            + ' WHERE loan_code = ' + formatString(loanCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getCollateralTypeId = function (typeName) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('Select id_collateral_type from tbl_collateral_type '
            + 'WHERE name_collateral_type = ' + formatString(typeName) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertCollateralFile = function (loanCode, fileName) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_collateral(loan_code, name_collateral_file) '
                + 'VALUES (' + formatString(loanCode) + ', ' + formatString(fileName) + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

module.exports = {
    approveDisbursement,
    approveLoan,
    getAllLoanList,
    getBorrowerFee,
    getCollectionMoney,
    getDetailAmount,
    getDetailProgressLoan,
    getExpiredFunding,
    getExpiredLoan,
    getInstallmentDetail,
    getLatestLoanCode,
    getLoanBunga,
    getLoanCodeExpire,
    getLoanCount,
    getLoanDetail,
    getOnProgressLoan,
    getUserFromLoan,
    insertInterestDetail,
    insertLoan,
    insertLoanCase,
    insertLoanExternal,
    getNewLoanList,
    updateLoanDocument,
    updateInstallmentComplete,
    getCountLoan,
    getVerifiedInvestor,
    insertPayorInformation,
    insertLoanRiskProfile,
    getLoanCode,
    getDataPayor,
    updatePayorInfo,
    getDataRisk,
    getDataBorrower,
    updateCredibility,
    updateTotalLoan,
    updateTujuanLoan,
    updateStatusDisburse,
    updateStatusLoanCase,
    getCollateralTypeId,
    insertCollateralFile
};

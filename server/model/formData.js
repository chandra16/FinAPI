const Connect = require('../service/dbPool');

const getEducation = function (roleid) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT id_education, name_education FROM tbl_education;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getJob = function (roleid) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT id_job, name_job FROM tbl_job;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getJobDuration = function (roleid) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT id_job_duration, name_job_duration FROM tbl_job_duration;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getJobSector = function (roleid) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT id_job_sector, name_job_sector FROM tbl_job_sector;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getMaritalStatus = function (roleid) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT marital_status_id, marital_status_description FROM tbl_marital_status;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getRevenue = function (roleid) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT monthly_income_id, monthly_income_description FROM tbl_monthly_income;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getReligion = function (roleid) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT religion_code, religion_description FROM tbl_religion;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getTitle = function (roleid) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT customer_title_id, customer_title_description FROM tbl_customer_title;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getBank = function (roleid) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT id_list_bank, kode_bank, nama_bank FROM tbl_list_bank;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getSourceFund = function (roleid) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT source_fund_id, source_fund_description FROM tbl_source_fund;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getCompanyDuration = function () {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT id_company_duration, name_company_duration FROM tbl_company_duration;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getCompanySector = function () {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT id_company_sector, name_company_sector FROM tbl_company_sector;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getCompanyEmployee = function () {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT id_company_employee, name_company_employee FROM tbl_company_employee;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

module.exports = {
    getEducation,
    getJob,
    getJobDuration,
    getJobSector,
    getMaritalStatus,
    getRevenue,
    getBank,
    getReligion,
    getTitle,
    getSourceFund,
    getCompanyDuration,
    getCompanySector,
    getCompanyEmployee
};

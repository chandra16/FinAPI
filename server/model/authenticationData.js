const Connect = require('../service/dbPool');

const formatString = function (string) {
    return '\'' + string + '\'';
};

const checkAuth = function (email) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT authentication_id FROM tbl_authentications WHERE email = ' + formatString(email)
                + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const checkPhone = function (codeCountry, phoneNumber) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT authentication_id FROM tbl_authentications '
            + 'WHERE code_country = ' + formatString(codeCountry)
            + ' AND no_hp = ' + formatString(phoneNumber)
            + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getDataforKYC = function (userCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT user.nama, user.tanggal_lahir, user.no_ktp, user.no_npwp, user.no_kitas, auth.code_country, auth.no_hp, bank.nomor_rekening, bank.nama_nasabah, list.pg_code as bank_code, user.upload_ktp, upload_selfie'
                + ' FROM tbl_authentications auth JOIN tbl_users user ON user.auth_id = auth.authentication_id JOIN tbl_bank bank on user.bank_id = bank.bank_id'
                + ' JOIN tbl_list_bank list ON bank.list_bank_id = list.id_list_bank '
                + ' WHERE user_code=' + formatString(userCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const checkEmail = function (email) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT email FROM tbl_authentications WHERE email=' + formatString(email) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const checkKtp = function (ktp) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT user_id, user_code FROM tbl_users WHERE no_ktp=' + formatString(ktp) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertAuthentication = function (email, password, codecountry, msisdn) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_authentications (code_country, email, hash_password, no_hp) VALUES ('
                + '\'' + codecountry + '\'' + ','
                + formatString(email) + ',' +
                '\'' + password + '\'' + ',' +
                '\'' + msisdn + '\');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertAuthenticationCase = function (email, password, codecountry, msisdn, isVerify) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_authentications (code_country, email, hash_password, no_hp, is_verify) VALUES ('
                + '\'' + codecountry + '\'' + ','
                + formatString(email) + ',' +
                '\'' + password + '\'' + ',' +
                '\'' + msisdn + '\',' +
                isVerify + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertAuthAdmin = function (email, password) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_authentications (email, hash_password, is_verify) VALUES ('
                + formatString(email) + ',' +
                '\'' + password + '\' , 2);');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const selectAuthentications = function (email, password, codecountry, msisdn) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT authentication_id FROM tbl_authentications WHERE '
                + 'email =\'' + email + '\' AND '
                + 'hash_password =\'' + password + '\' AND '
                + 'code_country =\'' + codecountry + '\' AND '
                + 'no_hp =\'' + msisdn + '\';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertUsers = function (authId, referalBy, nama, role) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_users (auth_id, role_id, referal_by, nama) VALUES (' + authId + ',' + role + ',' + formatString(referalBy) + ',' + formatString(nama) + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertUserAdmin = function (authId, nama, role, userCode) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_users (auth_id, role_id, nama, user_code, is_register) VALUES (' + authId + ',' + role + ',' + formatString(nama) + ',' + formatString(userCode) + ',1);');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const rollbackAuthenticationData = function (authId) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('DELETE FROM tbl_authentications WHERE authentication_id = ' + authId + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const rollbackAuthenticationDataWay2 = function (email, password, codecountry, msisdn) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('DELETE FROM tbl_authentications WHERE '
                + 'email =\'' + email + '\' AND '
                + 'hash_password =\'' + password + '\' AND '
                + 'code_country =\'' + codecountry + '\' AND '
                + 'no_hp =\'' + msisdn + '\';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getAuthDetail = function (email, noHp, userId) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            var whereClause;
            if (userId) {
                whereClause = 'WHERE user_id=' + formatString(userId);
            } else if (email) {
                whereClause = 'WHERE email=' + formatString(email);
            } else {
                whereClause = 'WHERE no_hp=' + formatString(noHp);
            }

            return connection.query('SELECT authentication_id, user_code, user_id, nama, email, no_hp, code_country, role_id, is_register, hash_password, is_verify, approval '
                + 'FROM tbl_authentications JOIN tbl_users '
                + 'ON tbl_authentications.authentication_id = tbl_users.auth_id '
                + whereClause + ' ORDER BY authentication_id desc;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getPhone = (authId) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT authentication_id, no_hp, code_country '
                + 'FROM tbl_authentications '
                + 'WHERE authentication_id=' + authId + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updateVerify = (verifyStatus, authId) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('UPDATE tbl_authentications SET is_verify = ' + verifyStatus
                + ' WHERE authentication_id = ' + authId + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getVerifyStatus = (authId) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT is_verify FROM tbl_authentications WHERE authentication_id=' + authId + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const updatePassword = function (email, newPassword) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('UPDATE tbl_authentications SET hash_password = ' + formatString(newPassword)
                + ' WHERE email = ' + formatString(email) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getUserDetail = (userCode) => {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT user_code, authentication_id, referal_by, nama, email, code_country, no_hp FROM tbl_users user '
                + 'LEFT JOIN tbl_authentications auth ON user.auth_id = auth.authentication_id WHERE user.user_code = ' + formatString(userCode) + ';');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const insertUsersExternal = function (authId, referalBy, nama, role) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_users (auth_id, role_id, referal_by, nama) VALUES (' + authId + ',' + role + ',' + formatString(referalBy) + ',' + formatString(nama) + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const getAuthDetailExternal = function (email, noHp, userId) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            var whereClause;
            if (userId) {
                whereClause = 'WHERE user_id=' + formatString(userId);
            } else if (email) {
                whereClause = 'WHERE email=' + formatString(email);
            } else {
                whereClause = 'WHERE no_hp=' + formatString(noHp);
            }

            return connection.query('SELECT authentication_id, user_code, user_id, nama, email, no_hp, code_country, role_id, is_register, hash_password, is_verify, approval '
                + 'FROM tbl_authentications JOIN tbl_users '
                + 'ON tbl_authentications.authentication_id = tbl_users.auth_id '
                + whereClause + ' ORDER BY authentication_id desc;');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

module.exports = {
    checkAuth,
    checkEmail,
    checkPhone,
    checkKtp,
    insertAuthentication,
    insertAuthenticationCase,
    insertUsersExternal,
    getAuthDetail,
    getAuthDetailExternal,
    getPhone,
    getUserDetail,
    getVerifyStatus,
    insertUsers,
    selectAuthentications,
    rollbackAuthenticationData,
    rollbackAuthenticationDataWay2,
    updateVerify,
    updatePassword,
    insertAuthAdmin,
    insertUserAdmin,
    getDataforKYC
};

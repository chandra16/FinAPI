const Connect = require('../service/dbPool');
const Moment = require('moment');

const formatString = function (string) {
    return '\'' + string + '\'';
};

const addSystemVariable = function (name, item) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('insert into tbl_system_variable(name, item)'
                + 'Values(' + formatString(name) + ', ' + formatString(item) + ')');
        })
        .then(function (results) {
            connectionContext.end();
            return Promise.resolve(results);
        });
};

const updateSystemVariable = function (id, item) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('update tbl_system_variable set item = ' + formatString(item)
                + ' where id = ' + id);
        })
        .then(function (results) {
            connectionContext.end();
            return Promise.resolve(results);
        });
};

const getSystemVariable = function (name) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('select * from tbl_system_variable where name = ' + formatString(name) + ' order by id asc');
        })
        .then(function (results) {
            connectionContext.end();
            return Promise.resolve(results);
        });
};

const getSystemVariableById = function (id) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('select * from tbl_system_variable where id = ' + id);
        })
        .then(function (results) {
            connectionContext.end();
            return Promise.resolve(results);
        });
};

const getBungaByTenor = function (tenorType, tenor, id) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('select b.id, r.id as rating_id, r.rating, b.bunga, b.service_fee, t.tenor, t.tenor_type, b.borrower_fee'
                + ' from tbl_bunga b join tbl_master_rating r on b.rating_id = r.id'
                + ' join tbl_tenor t on t.id = b.tenor_id'
                + (tenorType !== '' ? ' where t.tenor_type = ' + formatString(tenorType) : '')
                + (tenor > 0 ? ' and t.tenor =' + tenor : '')
                + (id > 0 ? ' and b.id =' + id : '')
                + ' order by r.id, t.tenor, b.bunga;');
        })
        .then(function (results) {
            connectionContext.end();
            return Promise.resolve(results);
        });
};

const getAllTenor = function () {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('select * from tbl_tenor order by tenor_type, tenor');
        })
        .then(function (results) {
            connectionContext.end();
            return Promise.resolve(results);
        });
};

const insertInterestRate = function (ratingId, tenorId, bunga, serviceFee, borrowerFee) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('insert into tbl_bunga(rating_id, tenor_id, bunga, service_fee, borrower_fee)'
                + 'Values(' + ratingId + ', ' + tenorId + ', ' + bunga + ', ' + serviceFee + ', ' + borrowerFee + ')');
        })
        .then(function (results) {
            connectionContext.end();
            return Promise.resolve(results);
        });
};

const updateInterestRate = function (interestId, ratingId, tenorId, bunga, serviceFee, borrowerFee) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('update tbl_bunga set rating_id = ' + ratingId
                + ', tenor_id = ' + tenorId
                + ', bunga = ' + bunga
                + ', service_fee = ' + serviceFee
                + ', borrower_fee = ' + borrowerFee
                + ' where id=' + interestId);
        })
        .then(function (results) {
            connectionContext.end();
            return Promise.resolve(results);
        });
};

const getListAgentComission = function () {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('SELECT * FROM tbl_agent_comission WHERE deleted = 0');
        })
        .then(function (results) {
            connectionContext.end();
            return Promise.resolve(results);
        });
};

const insertAgentComission = function (interestComission, lowerLimit, upperLimit, createdBy) {
    let connectionContext;

    console.log('');
    console.log('|============== DATA ADMIN INPUT NEW AGENT COMISSSION ===============|');
    console.log('| interestComission    => ', interestComission);
    console.log('| lowerLimit           => ', lowerLimit);
    console.log('| upperLimit           => ', upperLimit);
    console.log('| createdBy            => ', createdBy);
    console.log('|=========================== END OF DATA ============================|');
    console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'INSERT INTO tbl_agent_comission'
                + '(interest, lower_limit, upper_limit, created_by) '
                + 'VALUES(' + interestComission + ', ' + lowerLimit + ', ' + upperLimit + ', ' + formatString(createdBy) + ')');
        })
        .then(function (results) {
            connectionContext.end();
            return Promise.resolve(results);
        });
};

const updateAgentComission = function (idAgentCommission, interestCommission, lowerLimit, upperLimit, updatedBy) {
    let connectionContext;

    console.log('');
    console.log('|================== UPDATE DATA AGENT COMISSSION ====================|');
    console.log('| idAgentCommission    => ', idAgentCommission);
    console.log('| interestCommission   => ', interestCommission);
    console.log('| lowerLimit           => ', lowerLimit);
    console.log('| upperLimit           => ', upperLimit);
    console.log('| updatedBy            => ', updatedBy);
    console.log('| updatedAt            => ', Moment().format());
    console.log('|=========================== END OF DATA ============================|');
    console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'UPDATE tbl_agent_comission '
                + 'SET interest = ' + interestCommission + ','
                + ' lower_limit = ' + lowerLimit + ','
                + ' upper_limit = ' + upperLimit + ','
                + ' updated_at = ' + formatString(Moment().format()) + ','
                + ' updated_by = ' + formatString(updatedBy) + ' '
                + 'WHERE id_agent_commission = ' + idAgentCommission + ';');
        })
        .then(function (results) {
            connectionContext.end();
            return Promise.resolve(results);
        });
};

const deleteAgentComission = function (idAgentCommission, deletedBy) {
    let connectionContext;

    console.log('');
    console.log('|================== DELETE DATA AGENT COMISSSION ====================|');
    console.log('| idAgentCommission    => ', idAgentCommission);
    console.log('| deletedBy            => ', deletedBy);
    console.log('|=========================== END OF DATA ============================|');
    console.log('');

    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query(''
                + 'UPDATE tbl_agent_comission '
                + 'SET deleted = ' + 1 + ','
                + ' deleted_at = ' + formatString(Moment().format()) + ','
                + ' deleted_by = ' + formatString(deletedBy) + ' '
                + 'WHERE id_agent_commission = ' + idAgentCommission + ';');
        })
        .then(function (results) {
            connectionContext.end();
            return Promise.resolve(results);
        });
};

const getCollateralType = function () {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('select * from tbl_collateral_type');
        })
        .then(function (results) {
            connectionContext.end();
            return Promise.resolve(results);
        });
};

const getCollateralDetail = function (type) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('select * from tbl_collateral_detail WHERE id_collateral_type =' + type);
        })
        .then(function (results) {
            connectionContext.end();
            return Promise.resolve(results);
        });
};

const createCollateralType = function(nameType) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_collateral_type (name_collateral_type) VALUES ('
                +  formatString(nameType) + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

const createCollateralDetail = function(colTypeId, nameField) {
    let connectionContext;
    return Connect()
        .then(function (connection) {
            connectionContext = connection;
            return connection.query('INSERT INTO tbl_collateral_detail (id_collateral_type, name_field) VALUES ('
                + colTypeId + ','
                + formatString(nameField)
                + ');');
        })
        .then(function (results) {
            connectionContext.release();
            return Promise.resolve(results);
        });
};

module.exports = {
    addSystemVariable,
    updateSystemVariable,
    getSystemVariable,
    getSystemVariableById,
    getListAgentComission,
    getBungaByTenor,
    getAllTenor,
    insertInterestRate,
    insertAgentComission,
    updateInterestRate,
    updateAgentComission,
    deleteAgentComission,
    getCollateralType,
    getCollateralDetail,
    createCollateralType,
    createCollateralDetail
};

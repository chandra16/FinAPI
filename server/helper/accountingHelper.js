const ZahirAccounting = require('../service/zahirAccounting');


const getAllAccount = () => {
    return new Promise((resolve, reject) => {
        try {
            const listAccount = ZahirAccounting.getAccount();
            return resolve(listAccount);
        } catch (err) {
            Logger.write.log('error', 'get all Account error: ' + err.message);
            return reject(err);
        }
    });
};

const insertNewAccount = (code, name, aliasName, subclassification, currency, department, isCash, isActive) => {
    return new Promise((resolve, reject) => {
        try {
            const insertAccount = ZahirAccounting.insertAccount(code, name, aliasName, subclassification, currency, department, isCash, isActive);
            return resolve(insertAccount);
        } catch (err) {
            Logger.write.log('error', 'insert Account error: ' + err.message);
            return reject(err);
        }
    });
};

const updateAccount = (id, code, name, aliasName, subclassification, currency, department, isCash, isActive) => {
    return new Promise((resolve, reject) => {
        try {
            const updateAccounts = ZahirAccounting.updateAccount(id, code, name, aliasName, subclassification, currency, department, isCash, isActive);
            return resolve(updateAccounts);
        } catch (err) {
            Logger.write.log('error', 'update Account error: ' + err.message);
            return reject(err);
        }
    });
};

const deleteAccount = (id) => {
    return new Promise((resolve, reject) => {
        try {
            const deleteAccounts = ZahirAccounting.deleteAccount(id);
            return resolve(deleteAccounts);
        } catch (err) {
            Logger.write.log('error', 'delete Account error: ' + err.message);
            return reject(err);
        }
    });
};

const getAllAccountSubclassification = () => {
    return new Promise((resolve, reject) => {
        try {
            const listAccountSubclassification = ZahirAccounting.getAccountSubclassification();
            return resolve(listAccountSubclassification);
        } catch (err) {
            Logger.write.log('error', 'get all Account Subclassification error: ' + err.message);
            return reject(err);
        }
    });
};

const insertNewAccountSubclassification = (code, name, aliasName, classification, cashFlowType) => {
    return new Promise((resolve, reject) => {
        try {
            const insertAccountSubclassification = ZahirAccounting.insertAccountSubclassification(code, name, aliasName, classification, cashFlowType);
            return resolve(insertAccountSubclassification);
        } catch (err) {
            Logger.write.log('error', 'insert Account Subclassification error: ' + err.message);
            return reject(err);
        }
    });
};

const updateAccountSubclassification = (id, code, name, aliasName, classification, cashFlowType) => {
    return new Promise((resolve, reject) => {
        try {
            const updateAccountSubclassifications = ZahirAccounting.updateAccountSubclassification(id, code, name, aliasName, classification, cashFlowType);
            return resolve(updateAccountSubclassifications);
        } catch (err) {
            Logger.write.log('error', 'insert Account Subclassification error: ' + err.message);
            return reject(err);
        }
    });
};

const deleteAccountSubclassification = (id) => {
    return new Promise((resolve, reject) => {
        try {
            const deleteAccountSubclassifications = ZahirAccounting.deleteAccountSubclassification(id);
            return resolve(deleteAccountSubclassifications);
        } catch (err) {
            Logger.write.log('error', 'delete Account Subclassification error: ' + err.message);
            return reject(err);
        }
    });
};

const getAllAccountClassification = () => {
    return new Promise((resolve, reject) => {
        try {
            const listAccountClassification = ZahirAccounting.getAccountClassification();
            return resolve(listAccountClassification);
        } catch (err) {
            Logger.write.log('error', 'get all Account Classification error: ' + err.message);
            return reject(err);
        }
    });
};

const updateAccountClassification = (id, name, aliasName) => {
    return new Promise((resolve, reject) => {
        try {
            const updateAccountClassifications = ZahirAccounting.updateAccountClassification(id, name, aliasName);
            return resolve(updateAccountClassifications);
        } catch (err) {
            Logger.write.log('error', 'insert Account Classification error: ' + err.message);
            return reject(err);
        }
    });
};

const insertNewContact = (code, name, currency, address1, address2, city, country, postcode, addressB1, addressB2, cityB, countryB, postcodeB, telp1, telp2, fax, email, webpages, contact, note, handphone, position, creditLimit, termType, discountDays, dueDays, earlyDiscount, lateCharge, homePage, notes, contact2, contact3, commission, useCommissionTable, age, sex) => {
    return new Promise((resolve, reject) => {
        try {
            const insertNewContacs = ZahirAccounting.insertContacs(code, name, currency, address1, address2, city, country, postcode, addressB1, addressB2, cityB, countryB, postcodeB, telp1, telp2, fax, email, webpages, contact, note, handphone, position, creditLimit, termType, discountDays, dueDays, earlyDiscount, lateCharge, homePage, notes, contact2, contact3, commission, useCommissionTable, age, sex);
            return resolve(insertNewContacs);
        } catch (err) {
            Logger.write.log('error', 'insert Contact Subclassification error: ' + err.message);
            return reject(err);
        }
    });
};

const insertNewProduct = (code, name, category, aliasCode, aliasName, unitCost, unitPrice, unit, purchaseTax, salesTax, length, width, height, weight, note, mainSupplier, isTrackedAsInventory, isPurchased, isSold, inventoryAccount, cogsAccount, salesAccount, department, isActive) => {
    return new Promise((resolve, reject) => {
        try {
            const insertNewProducts = ZahirAccounting.insertProducts(code, name, category, aliasCode, aliasName, unitCost, unitPrice, unit, purchaseTax, salesTax, length, width, height, weight, note, mainSupplier, isTrackedAsInventory, isPurchased, isSold, inventoryAccount, cogsAccount, salesAccount, department, isActive);
            return resolve(insertNewProducts);
        } catch (err) {
            Logger.write.log('error', 'insert Product error: ' + err.message);
            return reject(err);
        }
    });
};

const insertNewProductCategories = (name, isTrackedAsInventory, isPurchasable, isSalable, inventoryAccount, cogsAccount, salesAccount, department, isCreateAccount) => {
    return new Promise((resolve, reject) => {
        try {
            const insertNewProductCategoriess = ZahirAccounting.insertProductCategories(name, isTrackedAsInventory, isPurchasable, isSalable, inventoryAccount, cogsAccount, salesAccount, department, isCreateAccount);
            return resolve(insertNewProductCategoriess);
        } catch (err) {
            Logger.write.log('error', 'insert Product Categories error: ' + err.message);
            return reject(err);
        }
    });
};

const insertNewUnit = (code, name, description, isBase) => {
    return new Promise((resolve, reject) => {
        try {
            const insertNewUnits = ZahirAccounting.insertUnits(code, name, description, isBase);
            return resolve(insertNewUnits);
        } catch (err) {
            Logger.write.log('error', 'insert Unit error: ' + err.message);
            return reject(err);
        }
    });
};

const insertNewTax = (code, name, percentage, purchaseTaxAccount, saleTaxAccount) => {
    return new Promise((resolve, reject) => {
        try {
            const insertNewTaxes = ZahirAccounting.insertTaxes(code, name, percentage, purchaseTaxAccount, saleTaxAccount);
            return resolve(insertNewTaxes);
        } catch (err) {
            Logger.write.log('error', 'insert Taxes error: ' + err.message);
            return reject(err);
        }
    });
};

const insertNewWarehouse = (code, name, address1, address2, city, country, postalCode, notes, isContainer, containerDimension, isActive) => {
    return new Promise((resolve, reject) => {
        try {
            const insertNewWarehouses = ZahirAccounting.insertWarehouse(code, name, address1, address2, city, country, postalCode, notes, isContainer, containerDimension, isActive);
            return resolve(insertNewWarehouses);
        } catch (err) {
            Logger.write.log('error', 'insert Warehouses error: ' + err.message);
            return reject(err);
        }
    });
};

const insertNewDepartment = (code, name, manager, parentDepartment, field, notes) => {
    return new Promise((resolve, reject) => {
        try {
            const insertNewDepartments = ZahirAccounting.insertDepartments(code, name, manager, parentDepartment, field, notes);
            return resolve(insertNewDepartments);
        } catch (err) {
            Logger.write.log('error', 'insert Department error: ' + err.message);
            return reject(err);
        }
    });
};

const insertNewProject = (code, name, description, orderNumber, orderDate, completionDueDate, startDate, endDate, customer, contactPerson, manager, status, isJobOrder, isUsePhase, percentage, isActive) => {
    return new Promise((resolve, reject) => {
        try {
            const insertNewProjects = ZahirAccounting.insertProjects(code, name, description, orderNumber, orderDate, completionDueDate, startDate, endDate, customer, contactPerson, manager, status, isJobOrder, isUsePhase, percentage, isActive);
            return resolve(insertNewProjects);
        } catch (err) {
            Logger.write.log('error', 'insert Project error: ' + err.message);
            return reject(err);
        }
    });
};

const insertNewProjectStatus = (name, description) => {
    return new Promise((resolve, reject) => {
        try {
            const insertNewProjectStatuses = ZahirAccounting.insertProjectStatuses(name, description);
            return resolve(insertNewProjectStatuses);
        } catch (err) {
            Logger.write.log('error', 'insert Project Statuses error: ' + err.message);
            return reject(err);
        }
    });
};

const insertNewPosPaymentMethod = (code, name, manager, parentDepartment, field, notes) => {
    return new Promise((resolve, reject) => {
        try {
            const insertNewPosPaymentMethods = ZahirAccounting.insertPosPaymentMethods(code, name, manager, parentDepartment, field, notes);
            return resolve(insertNewPosPaymentMethods);
        } catch (err) {
            Logger.write.log('error', 'insert POS Payment Method error: ' + err.message);
            return reject(err);
        }
    });
};

const insertNewReceivableBeginningBalance = (invoiceNumber, invoiceDate, description, salesOrder, customer, salesman, department, project, currency, dueDaysTOP, lateChargeTOP, discountDaysTOP, earlyDiscountTOP, numberDoc, dateDoc, accountReceiv, amountReceiv) => {
    return new Promise((resolve, reject) => {
        try {
            const insertNewReceivableBeginningBalances = ZahirAccounting.insertReceivableBeginningBalances(invoiceNumber, invoiceDate, description, salesOrder, customer, salesman, department, project, currency, dueDaysTOP, lateChargeTOP, discountDaysTOP, earlyDiscountTOP, numberDoc, dateDoc, accountReceiv, amountReceiv);
            return resolve(insertNewReceivableBeginningBalances);
        } catch (err) {
            Logger.write.log('error', 'insert Receivable Beginning Balance error: ' + err.message);
            return reject(err);
        }
    });
};

const insertNewPayableBeginningBalance = (invoiceNumber, invoiceDate, description, purchaseOrders, supplier, employee, department, project, currency, dueDaysTOP, lateChargeTOP, discountDaysTOP, earlyDiscountTOP, numberDoc, dateDoc, accountPay, amountPay) => {
    return new Promise((resolve, reject) => {
        try {
            const insertNewPayableBeginningBalances = ZahirAccounting.insertPayableBeginningBalances(invoiceNumber, invoiceDate, description, purchaseOrders, supplier, employee, department, project, currency, dueDaysTOP, lateChargeTOP, discountDaysTOP, earlyDiscountTOP, numberDoc, dateDoc, accountPay, amountPay);
            return resolve(insertNewPayableBeginningBalances);
        } catch (err) {
            Logger.write.log('error', 'insert Payable Beginning Balance error: ' + err.message);
            return reject(err);
        }
    });
};

const insertNewSalesQuotation = (id, quotationNumber, quotationDate, validityDate, isFinished, description, customer, salesman, department, project, warehouse, currency, isCash, dueDaysTOP, lateChargeTOP, discountDaysTOP, earlyDiscountTOP , numberDoc, dateDoc, idLineItems, productLineItems, accountLineItems, descriptionLineItems, notesLineItems, quantityLineItems, unitLineItems, unitPriceLineItems, discountLineItems, taxLineItems, departmentLineItems, projectLineItems , accountOthers, amountOthers, accountTotal, amountTotal) => {
    return new Promise((resolve, reject) => {
        try {
            const insertNewSalesQuotations = ZahirAccounting.insertSalesQuotations(id, quotationNumber, quotationDate, validityDate, isFinished, description, customer, salesman, department, project, warehouse, currency, isCash, dueDaysTOP, lateChargeTOP, discountDaysTOP, earlyDiscountTOP , numberDoc, dateDoc, idLineItems, productLineItems, accountLineItems, descriptionLineItems, notesLineItems, quantityLineItems, unitLineItems, unitPriceLineItems, discountLineItems, taxLineItems, departmentLineItems, projectLineItems , accountOthers, amountOthers, accountTotal, amountTotal);
            return resolve(insertNewSalesQuotations);
        } catch (err) {
            Logger.write.log('error', 'insert Sales Quotation error: ' + err.message);
            return reject(err);
        }
    });
};

module.exports = {
    getAllAccount,
    getAllAccountSubclassification,
    getAllAccountClassification,
    insertNewAccount,
    insertNewAccountSubclassification,
    insertNewContact,
    insertNewProduct,
    insertNewProductCategories,
    insertNewUnit,
    insertNewTax,
    insertNewWarehouse,
    insertNewDepartment,
    insertNewProject,
    insertNewProjectStatus,
    insertNewPosPaymentMethod,
    insertNewReceivableBeginningBalance,
    insertNewPayableBeginningBalance,
    insertNewSalesQuotation,
    updateAccount,
    updateAccountSubclassification,
    updateAccountClassification,
    deleteAccount,
    deleteAccountSubclassification
};

const _ = require('lodash');
const Joi = require('joi');
const Boom = require('boom');
const AccountingHelper = require('../helper/accountingHelper');
const Word2pdf = require('word2pdf');
const Fs = require('fs');

const getAccount = async (request, h) => {
    const req = request.payload;
    try {
        const listAccount = await AccountingHelper.getAllAccount();
        return h.response(listAccount);
    } catch (err) {
        throw Boom.notFound(err.message);
    }
};

const insertAccount = async (request, h) => {
    const req = request.payload;
    try {
        const insertAccounts = await AccountingHelper.insertNewAccount(
            req.code,
            req.name,
            req.alias_name,
            req.subclassification,
            req.currency,
            req.department,
            req.is_cash,
            req.is_active
        );
        return h.response(insertAccounts);
    } catch (err) {
        throw Boom.notFound(err.message);
    }
};

const updateAccount = async (request, h) => {
    const req = request.payload;
    try {
        const updateAccounts = await AccountingHelper.updateAccount(
            req.id,
            req.code,
            req.name,
            req.alias_name,
            req.subclassification,
            req.currency,
            req.department,
            req.is_cash,
            req.is_active
        );
        return h.response(updateAccounts);
    } catch (err) {
        throw Boom.notFound(err.message);
    }
};

const deleteAccount = async (request, h) => {
    const req = request.payload;
    try {
        const deleteAccounts = await AccountingHelper.deleteAccount(
            req.id
        );
        return h.response(deleteAccounts);
    } catch (err) {
        throw Boom.notFound(err.message);
    }
};

const getAccountSubclassification = async (request, h) => {
    const req = request.payload;
    try {
        const listAccountSubclassification = await AccountingHelper.getAllAccountSubclassification();
        return h.response(listAccountSubclassification);
    } catch (err) {
        throw Boom.notFound(err.message);
    }
};

const insertAccountSubclassification = async (request, h) => {
    const req = request.payload;
    try {
        const insertAccountsSubclassification = await AccountingHelper.insertNewAccountSubclassification(
            req.code,
            req.name,
            req.alias_name,
            req.classification,
            req.cash_flow_type
        );
        return h.response(insertAccountsSubclassification);
    } catch (err) {
        throw Boom.notFound(err.message);
    }
};

const updateAccountSubclassification = async (request, h) => {
    const req = request.payload;
    try {
        const updateAccountsSubclassification = await AccountingHelper.updateAccountSubclassification(
            req.id,
            req.code,
            req.name,
            req.alias_name,
            req.classification,
            req.cash_flow_type
        );
        return h.response(updateAccountsSubclassification);
    } catch (err) {
        throw Boom.notFound(err.message);
    }
};

const deleteAccountSubclassification = async (request, h) => {
    const req = request.payload;
    try {
        const deleteAccountSubclassifications = await AccountingHelper.deleteAccountSubclassification(
            req.id
        );
        return h.response(deleteAccountSubclassifications);
    } catch (err) {
        throw Boom.notFound(err.message);
    }
};

const getAccountClassification = async (request, h) => {
    const req = request.payload;
    try {
        const listAccountClassification = await AccountingHelper.getAllAccountClassification();
        return h.response(listAccountClassification);
    } catch (err) {
        throw Boom.notFound(err.message);
    }
};

const updateAccountClassification = async (request, h) => {
    const req = request.payload;
    try {
        const updateAccountsClassification = await AccountingHelper.updateAccountClassification(
            req.id,
            req.name,
            req.alias_name
        );
        return h.response(updateAccountsClassification);
    } catch (err) {
        throw Boom.notFound(err.message);
    }
};

const insertContacts = async (request, h) => {
    const req = request.payload;
    try {
        const insertNewContacts = await AccountingHelper.insertNewContact(
            req.code,
            req.name,
            req.currency,
            req.address1,
            req.address2,
            req.city,
            req.country,
            req.postcode,
            req.addressB1,
            req.addressB2,
            req.cityB,
            req.countryB,
            req.postcodeB,
            req.telp1,
            req.telp2,
            req.fax,
            req.email,
            req.webpages,
            req.contact,
            req.note,
            req.handphone,
            req.position,
            req.creditLimit,
            req.termType,
            req.discountDays,
            req.dueDays,
            req.earlyDiscount,
            req.lateCharge,
            req.homePage,
            req.notes,
            req.contact2,
            req.contact3,
            req.commission,
            req.useCommissionTable,
            req.age,
            req.sex
        );

        return h.response(insertNewContacts);
    }
    catch (err) {
        throw Boom.notFound(err.message);
    }
};

const insertProducts = async (request, h) => {
    const req = request.payload;
    try {
        const insertNewProducts = await AccountingHelper.insertNewProduct(
            req.code,
            req.name,
            req.category,
            req.aliasCode,
            req.aliasName,
            req.unitCost,
            req.unitPrice,
            req.unit,
            req.purchaseTax,
            req.salesTax,
            req.length,
            req.width,
            req.height,
            req.weight,
            req.note,
            req.mainSupplier,
            req.isTrackedAsInventory,
            req.isPurchased,
            req.isSold,
            req.inventoryAccount,
            req.cogsAccount,
            req.salesAccount,
            req.department,
            req.isActive
        );

        return h.response(insertNewProducts);
    }
    catch (err) {
        throw Boom.notFound(err.message);
    }
};

const insertProductCategories = async (request, h) => {
    const req = request.payload;
    try {
        const insertNewProductCategoriess = await AccountingHelper.insertNewProductCategories(
            req.name,
            req.isTrackedAsInventory,
            req.isPurchasable,
            req.isSalable,
            req.inventoryAccount,
            req.cogsAccount,
            req.salesAccount,
            req.department,
            req.isCreateAccount
        );

        return h.response(insertNewProductCategoriess);
    }
    catch (err) {
        throw Boom.notFound(err.message);
    }
};

const insertUnit = async (request, h) => {
    const req = request.payload;
    try {
        const insertUnits = await AccountingHelper.insertNewUnit(
            req.code,
            req.name,
            req.description,
            req.isBase
        );

        return h.response(insertUnits);
    }
    catch (err) {
        throw Boom.notFound(err.message);
    }
};

const insertTax = async (request, h) => {
    const req = request.payload;
    try {
        const insertTaxes = await AccountingHelper.insertNewTax(
            req.code,
            req.name,
            req.percentage,
            req.purchaseTaxAccount,
            req.saleTaxAccount
        );

        return h.response(insertTaxes);
    }
    catch (err) {
        throw Boom.notFound(err.message);
    }
};

const insertWarehouse = async (request, h) => {
    const req = request.payload;
    try {
        const insertWarehouses = await AccountingHelper.insertNewWarehouse(
            req.code,
            req.name,
            req.address1,
            req.address2,
            req.city,
            req.country,
            req.postalCode,
            req.notes,
            req.isContainer,
            req.containerDimension,
            req.isActive
        );

        return h.response(insertWarehouses);
    }
    catch (err) {
        throw Boom.notFound(err.message);
    }
};

const insertDepartment = async (request, h) => {
    const req = request.payload;
    try {
        const insertDepartments = await AccountingHelper.insertNewDepartment(
            req.code,
            req.name,
            req.manager,
            req.parentDepartment,
            req.field,
            req.notes
        );

        return h.response(insertDepartments);
    }
    catch (err) {
        throw Boom.notFound(err.message);
    }
};

const insertProject = async (request, h) => {
    const req = request.payload;
    try {
        const insertProjects = await AccountingHelper.insertNewProject(
            req.code,
            req.name,
            req.description,
            req.orderNumber,
            req.orderDate,
            req.completionDueDate,
            req.startDate,
            req.endDate,
            req.customer,
            req.contactPerson,
            req.manager,
            req.status,
            req.isJobOrder,
            req.isUsePhase,
            req.percentage,
            req.isActive
        );

        return h.response(insertProjects);
    }
    catch (err) {
        throw Boom.notFound(err.message);
    }
};

const insertProjectStatus = async (request, h) => {
    const req = request.payload;
    try {
        const insertProjectStatuses = await AccountingHelper.insertNewProjectStatus(
            req.name,
            req.description
        );

        return h.response(insertProjectStatuses);
    }
    catch (err) {
        throw Boom.notFound(err.message);
    }
};

const insertPosPaymentMethod = async (request, h) => {
    const req = request.payload;
    try {
        const insertPosPaymentMethods = await AccountingHelper.insertNewPosPaymentMethod(
            req.code,
            req.name,
            req.manager,
            req.parentDepartment,
            req.field,
            req.notes
        );

        return h.response(insertPosPaymentMethods);
    }
    catch (err) {
        throw Boom.notFound(err.message);
    }
};

const insertReceivableBeginningBalance = async (request, h) => {
    const req = request.payload;
    try {
        const insertReceivableBeginningBalances = await AccountingHelper.insertNewReceivableBeginningBalance(
            req.invoiceNumber,
            req.invoiceDate,
            req.description,
            req.salesOrder,
            req.customer,
            req.salesman,
            req.department,
            req.project,
            req.currency,
            req.dueDaysTOP,
            req.lateChargeTOP,
            req.discountDaysTOP,
            req.earlyDiscountTOP,
            req.numberDoc,
            req.dateDoc,
            req.accountReceiv,
            req.amountReceiv
        );

        return h.response(insertReceivableBeginningBalances);
    }
    catch (err) {
        throw Boom.notFound(err.message);
    }
};

const insertPayableBeginningBalance = async (request, h) => {
    const req = request.payload;
    try {
        const insertPayableBeginningBalances = await AccountingHelper.insertNewPayableBeginningBalance(
            req.invoiceNumber,
            req.invoiceDate,
            req.description,
            req.purchaseOrders,
            req.supplier,
            req.employee,
            req.department,
            req.project,
            req.currency,
            req.dueDaysTOP,
            req.lateChargeTOP,
            req.discountDaysTOP,
            req.earlyDiscountTOP,
            req.numberDoc,
            req.dateDoc,
            req.accountPay,
            req.amountPay
        );

        return h.response(insertPayableBeginningBalances);
    }
    catch (err) {
        throw Boom.notFound(err.message);
    }
};

const insertSalesQuotation = async (request, h) => {
    const req = request.payload;
    try {
        const insertSalesQuotations = await AccountingHelper.insertNewSalesQuotation(
            req.id,
            req.quotationNumber,
            req.quotationDate,
            req.validityDate,
            req.isFinished,
            req.description,
            req.customer,
            req.salesman,
            req.department,
            req.project,
            req.warehouse,
            req.currency,
            req.isCash,
            req.dueDaysTOP,
            req.lateChargeTOP,
            req.discountDaysTOP,
            req.earlyDiscountTOP,
            req.numberDoc,
            req.dateDoc,
            req.idLineItems,
            req.productLineItems,
            req.accountLineItems,
            req.descriptionLineItems,
            req.notesLineItems,
            req.quantityLineItems,
            req.unitLineItems,
            req.unitPriceLineItems,
            req.discountLineItems,
            req.taxLineItems,
            req.departmentLineItems,
            req.projectLineItems,
            req.accountOthers,
            req.amountOthers,
            req.accountTotal,
            req.amountTotal
        );

        return h.response(insertSalesQuotations);
    }
    catch (err) {
        throw Boom.notFound(err.message);
    }
};

exports.plugin = {
    register: (server, options) => {
        options = _.extend({ basePath: '' }, options);

        server.route([{
            method: 'POST',
            path: options.basePath + '/get-account',
            handler: getAccount,
            options: {
                description: 'Get list of Account',
                tags: ['api', 'auth'],
                auth: false
            }
        }, {
            method: 'POST',
            path: options.basePath + '/insert-account',
            handler: insertAccount,
            options: {
                description: 'Insert new Account ',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        code: Joi.number(),
                        name: Joi.string().required(),
                        alias_name: Joi.string(),
                        subclassification: Joi.string().required(),
                        currency: Joi.string(),
                        department: Joi.string(),
                        is_cash: Joi.bool(),
                        is_active: Joi.bool()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/update-account',
            handler: updateAccount,
            options: {
                description: 'Update existing Account ',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        id: Joi.string().required(),
                        code: Joi.number(),
                        name: Joi.string().required(),
                        alias_name: Joi.string(),
                        subclassification: Joi.string().required(),
                        currency: Joi.string(),
                        department: Joi.string(),
                        is_cash: Joi.bool(),
                        is_active: Joi.bool()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/delete-account',
            handler: deleteAccount,
            options: {
                description: 'Delete existing Account ',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        id: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/get-account-subclassification',
            handler: getAccountSubclassification,
            options: {
                description: 'Get list of Account Subclassification',
                tags: ['api', 'auth'],
                auth: false
            }
        }, {
            method: 'POST',
            path: options.basePath + '/insert-account-subclassification',
            handler: insertAccountSubclassification,
            options: {
                description: 'Insert new Account Subclassification ',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        code: Joi.number(),
                        name: Joi.string().required(),
                        alias_name: Joi.string(),
                        classification: Joi.string().required(),
                        cash_flow_type: Joi.string()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/update-account-subclassification',
            handler: updateAccountSubclassification,
            options: {
                description: 'Update new Account Subclassification ',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        id: Joi.string().required(),
                        code: Joi.number(),
                        name: Joi.string().required(),
                        alias_name: Joi.string(),
                        classification: Joi.string().required(),
                        cash_flow_type: Joi.string()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/delete-account-subclassification',
            handler: deleteAccountSubclassification,
            options: {
                description: 'Delete existing Account Subclassification ',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        id: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/get-account-classification',
            handler: getAccountClassification,
            options: {
                description: 'Get list of Account Classification',
                tags: ['api', 'auth'],
                auth: false
            }
        }, {
            method: 'POST',
            path: options.basePath + '/update-account-classification',
            handler: updateAccountClassification,
            options: {
                description: 'Update existing Account Classification',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        id: Joi.string().required(),
                        name: Joi.string().required(),
                        alias_name: Joi.string()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/insert-contact',
            handler: insertContacts,
            options: {
                description: 'Insert new Contact ',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        code: Joi.string().required(),
                        name: Joi.string().required(),
                        currency: Joi.string().required(),
                        address1: Joi.string(),
                        address2: Joi.string(),
                        city: Joi.string(),
                        country: Joi.string(),
                        postcode: Joi.string(),
                        addressB1: Joi.string(),
                        addressB2: Joi.string(),
                        cityB: Joi.string(),
                        countryB: Joi.string(),
                        postcodeB: Joi.string(),
                        telp1: Joi.string(),
                        telp2: Joi.string(),
                        fax: Joi.string(),
                        email: Joi.string(),
                        webpages: Joi.string(),
                        contact: Joi.string(),
                        note: Joi.string(),
                        handphone: Joi.string(),
                        position: Joi.number(),
                        creditLimit: Joi.number(),
                        termType: Joi.number(),
                        discountDays: Joi.number(),
                        dueDays: Joi.number(),
                        earlyDiscount: Joi.number(),
                        lateCharge: Joi.number(),
                        homePage: Joi.string(),
                        notes: Joi.string(),
                        contact2: Joi.string(),
                        contact3: Joi.string(),
                        commission: Joi.string(),
                        useCommissionTable: Joi.string(),
                        age: Joi.string(),
                        sex: Joi.string()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/insert-product',
            handler: insertProducts,
            options: {
                description: 'Insert new Product ',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        code: Joi.string().required(),
                        name: Joi.string().required(),
                        category: Joi.string().required(),
                        aliasCode: Joi.string(),
                        aliasName: Joi.string(),
                        unitCost: Joi.number().required(),
                        unitPrice: Joi.number().required(),
                        unit: Joi.string().required(),
                        purchaseTax: Joi.string().required(),
                        salesTax: Joi.string().required(),
                        length: Joi.number().required(),
                        width: Joi.number().required(),
                        height: Joi.number().required(),
                        weight: Joi.number().required(),
                        note: Joi.string(),
                        mainSupplier: Joi.string(),
                        isTrackedAsInventory: Joi.boolean().required(),
                        isPurchased: Joi.boolean().required(),
                        isSold: Joi.boolean().required(),
                        inventoryAccount: Joi.string().required(),
                        cogsAccount: Joi.string().required(),
                        salesAccount: Joi.string().required(),
                        department: Joi.string().required(),
                        isActive: Joi.boolean().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/insert-product-categories',
            handler: insertProductCategories,
            options: {
                description: 'Insert new Product Categories',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        name: Joi.string().required(),
                        isTrackedAsInventory: Joi.boolean().required(),
                        isPurchasable: Joi.boolean().required(),
                        isSalable: Joi.boolean().required(),
                        inventoryAccount: Joi.string().required(),
                        cogsAccount: Joi.string().required(),
                        salesAccount: Joi.string().required(),
                        department: Joi.string().required(),
                        isCreateAccount: Joi.boolean().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/insert-unit',
            handler: insertUnit,
            options: {
                description: 'Insert new Unit',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        code: Joi.string(),
                        name: Joi.string().required(),
                        description: Joi.string(),
                        isBase: Joi.boolean()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/insert-tax',
            handler: insertTax,
            options: {
                description: 'Insert new Taxes',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        code: Joi.string(),
                        name: Joi.string().required(),
                        percentage: Joi.number(),
                        purchaseTaxAccount: Joi.string(),
                        saleTaxAccount: Joi.string()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/insert-warehouses',
            handler: insertWarehouse,
            options: {
                description: 'Insert new Warehouses',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        code: Joi.string(),
                        name: Joi.string(),
                        address1: Joi.string(),
                        address2: Joi.string(),
                        city: Joi.string(),
                        country: Joi.string(),
                        postalCode: Joi.string(),
                        notes: Joi.string(),
                        isContainer: Joi.boolean(),
                        containerDimension: Joi.number(),
                        isActive: Joi.boolean()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/insert-departments',
            handler: insertDepartment,
            options: {
                description: 'Insert new Department',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        code: Joi.string().required(),
                        name: Joi.string().required(),
                        manager: Joi.string(),
                        parentDepartment: Joi.string(),
                        field: Joi.string(),
                        notes: Joi.string()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/insert-projects',
            handler: insertProject,
            options: {
                description: 'Insert new Project',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        code: Joi.string(),
                        name: Joi.string().required(),
                        description: Joi.string(),
                        orderNumber: Joi.string(),
                        orderDate: Joi.string(),
                        completionDueDate: Joi.string(),
                        startDate: Joi.string(),
                        endDate: Joi.string(),
                        customer: Joi.string(),
                        contactPerson: Joi.string(),
                        manager: Joi.string(),
                        status: Joi.string(),
                        isJobOrder: Joi.boolean(),
                        isUsePhase: Joi.boolean(),
                        percentage: Joi.number(),
                        isActive: Joi.boolean()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/insert-project-status',
            handler: insertProjectStatus,
            options: {
                description: 'Insert new Project Status',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        name: Joi.string().required(),
                        description: Joi.string()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/insert-pos-payment-method',
            handler: insertPosPaymentMethod,
            options: {
                description: 'Insert new POS Payment Method',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        code: Joi.string().required(),
                        name: Joi.string().required(),
                        manager: Joi.string(),
                        parentDepartment: Joi.string(),
                        field: Joi.string(),
                        notes: Joi.string()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/insert-receivable-beginning-balances',
            handler: insertReceivableBeginningBalance,
            options: {
                description: 'Insert new Receivable Beginning Balance',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        invoiceNumber: Joi.string().required(),
                        invoiceDate: Joi.string().required(),
                        description: Joi.string(),
                        salesOrder: Joi.string(),
                        customer: Joi.string().required(),
                        salesman: Joi.string(),
                        department: Joi.string(),
                        project: Joi.string(),
                        currency: Joi.string(),
                        dueDaysTOP: Joi.number(),
                        lateChargeTOP: Joi.number(),
                        discountDaysTOP: Joi.number(),
                        earlyDiscountTOP: Joi.number(),
                        numberDoc: Joi.string(),
                        dateDoc: Joi.string(),
                        accountReceiv: Joi.string(),
                        amountReceiv: Joi.number().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/insert-payable-beginning-balances',
            handler: insertPayableBeginningBalance,
            options: {
                description: 'Insert new Payable Beginning Balance',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        invoiceNumber: Joi.string().required(),
                        invoiceDate: Joi.string().required(),
                        description: Joi.string(),
                        purchaseOrders: Joi.string(),
                        supplier: Joi.string().required(),
                        employee: Joi.string(),
                        department: Joi.string(),
                        project: Joi.string(),
                        currency: Joi.string(),
                        dueDaysTOP: Joi.number(),
                        lateChargeTOP: Joi.number(),
                        discountDaysTOP: Joi.number(),
                        earlyDiscountTOP: Joi.number(),
                        numberDoc: Joi.string(),
                        dateDoc: Joi.string(),
                        accountPay: Joi.string(),
                        amountPay: Joi.number().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/insert-sales-quotation',
            handler: insertSalesQuotation,
            options: {
                description: 'Insert new Sales Quotation',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        id: Joi.string().required(),
                        quotationNumber: Joi.string(),
                        quotationDate: Joi.string(),
                        validityDate: Joi.string(),
                        isFinished: Joi.boolean(),
                        description: Joi.string(),
                        customer: Joi.string(),
                        salesman: Joi.string(),
                        department: Joi.string(),
                        project: Joi.string(),
                        warehouse: Joi.string(),
                        currency: Joi.string(),
                        isCash: Joi.boolean(),
                        dueDaysTOP: Joi.number(),
                        lateChargeTOP: Joi.number(),
                        discountDaysTOP: Joi.number(),
                        earlyDiscountTOP: Joi.number(),
                        numberDoc: Joi.string(),
                        dateDoc: Joi.string(),
                        idLineItems: Joi.string(),
                        productLineItems: Joi.string(),
                        accountLineItems: Joi.string(),
                        descriptionLineItems: Joi.string(),
                        notesLineItems: Joi.string(),
                        quantityLineItems: Joi.number(),
                        unitLineItems: Joi.string(),
                        unitPriceLineItems: Joi.number(),
                        discountLineItems: Joi.number(),
                        taxLineItems: Joi.string(),
                        departmentLineItems: Joi.string(),
                        projectLineItems: Joi.string(),
                        accountOthers: Joi.string(),
                        amountOthers: Joi.number(),
                        accountTotal: Joi.string(),
                        amountTotal: Joi.number()
                    }
                }
            }
        }]);
    },

    'name': 'api-accounting'
};

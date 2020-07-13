'use strict';

const Config = require('../../config');
const Logger = require('../helper/logger');
const Request = require('request');

const __header = () => {
    const apiHeader = {
        'Authorization': 'Bearer ' + Config.get('/zahirAccounting/authKey'),
        'Slug': Config.get('/zahirAccounting/slug')
    };
    return apiHeader;
};

const __request = (methodRequest, path, data) => {
    return new Promise((resolve, reject) => {
        const options = {
            'uri': Config.get('/zahirAccounting/server') + path,
            'method': methodRequest,
            'headers': __header(),
            'body': JSON.stringify(data)
        };

        console.log('');
        console.log('|--------------------------- ZAHIR ACCOUNTING ------------------------------|');
        console.log('| PATH : ', path);
        console.log('|---------------------------------------------------------------------------|');
        console.log(options);
        console.log('|---------------------------------------------------------------------------|');
        console.log('');

        Request(options, (err, response) => {
            if (err) {
                Logger.write.log('error', 'Zahir api request error for operation: ' + path + ', with error : ' + err.message);
                return reject({ 'message': 'Zahir api failed for operation: ' + path });
            }

            return resolve(response.body);
        });
    });
};



/**
 **** =========================== ACCOUNTS =========================================================== ***
 */
const getAccount = () => {
    return new Promise(async (resolve, reject) => {
        // URL
        const url = '/api/accounts';

        // Payloads Data Body
        const data = {};

        try {
            const responseBody = await __request('GET', url, data);
            const responseVal = JSON.parse(responseBody);

            // console.log('RESPONSE VAL => ', JSON.stringify(responseVal));

            return resolve(responseVal);
        } catch (err) {
            Logger.write.log('error', 'Generate api request error for: ' + url + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to generate request' });
        }
    });
};

const insertAccount = (code, name, aliasName, subclassification, currency, department, isCash, isActive) => {
    return new Promise(async (resolve, reject) => {
        // URL
        const url = '/api/accounts';

        // Payloads Data Body
        const data = {
            code: code,                             // MAX 9 DIGIT
            name: name,                             // MAX 50 CHAR  | Required.
            alias_name: aliasName,                  // MAX 50 CHAR
            subclassification: subclassification,   // 36 CHAR      | Required.
            currency: currency,                     // 36 CHAR
            department: department,                 // 36 CHAR
            is_cash: isCash,                        // Bool
            is_active: isActive                     // Bool
        };

        try {
            const responseBody = await __request('POST', url, data);
            const responseVal = JSON.parse(responseBody);

            // console.log('RESPONSE VAL => ', JSON.stringify(responseVal));

            return resolve(responseVal);
        } catch (err) {
            Logger.write.log('error', 'Generate api request error for: ' + url + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to generate request' });
        }
    });
};

const updateAccount = (id, code, name, aliasName, subclassification, currency, department, isCash, isActive) => {
    return new Promise(async (resolve, reject) => {
        // URL
        const url = '/api/accounts/' + id;

        // Payloads Data Body
        const data = {
            code: code,                             // MAX 9 DIGIT
            name: name,                             // MAX 50 CHAR  | Required.
            alias_name: aliasName,                  // MAX 50 CHAR
            subclassification: subclassification,   // 36 CHAR      | Required.
            currency: currency,                     // 36 CHAR
            department: department,                 // 36 CHAR
            is_cash: isCash,                        // Bool
            is_active: isActive                     // Bool
        };

        try {
            const responseBody = await __request('PUT', url, data);
            const responseVal = JSON.parse(responseBody);

            // console.log('RESPONSE VAL => ', JSON.stringify(responseVal));

            return resolve(responseVal);
        } catch (err) {
            Logger.write.log('error', 'Generate api request error for: ' + url + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to generate request' });
        }
    });
};

const deleteAccount = (id) => {
    return new Promise(async (resolve, reject) => {
        // URL
        const url = '/api/accounts/' + id;

        // Payloads Data Body
        const data = {};

        try {
            const responseBody = await __request('DELETE', url, data);
            const responseVal = JSON.parse(responseBody);

            // console.log('RESPONSE VAL => ', JSON.stringify(responseVal));

            return resolve(responseVal);
        } catch (err) {
            Logger.write.log('error', 'Generate api request error for: ' + url + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to generate request' });
        }
    });
};
/**
 **** ================================================================================================ ***
 */



/**
 **** =========================== ACCOUNT SUBCLASSIFICATION ========================================== ***
 */
const getAccountSubclassification = () => {
    return new Promise(async (resolve, reject) => {
        // URL
        const url = '/api/account_subclassifications';

        // Payloads Data Body
        const data = {};

        try {
            const responseBody = await __request('GET', url, data);
            const responseVal = JSON.parse(responseBody);

            // console.log('RESPONSE VAL => ', JSON.stringify(responseVal));

            return resolve(responseVal);
        } catch (err) {
            Logger.write.log('error', 'Generate api request error for: ' + url + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to generate request' });
        }
    });
};

const insertAccountSubclassification = (code, name, aliasName, classification, cashFlowType) => {
    return new Promise(async (resolve, reject) => {
        // URL
        const url = '/api/account_subclassifications';

        // Payloads Data Body
        const data = {
            code: code,                             // MAX 9 DIGIT
            name: name,                             // MAX 40 CHAR  | Required.
            alias_name: aliasName,                  // MAX 40 CHAR
            classification: classification,         // 36 CHAR      | Required.
            cash_flow_type: cashFlowType            // 1 Integer    | 0 : Undifinied, 1 : Operating Activities, 2 : Investing Activities, 3 : Financing Activities.
        };

        try {
            const responseBody = await __request('POST', url, data);
            const responseVal = JSON.parse(responseBody);

            // console.log('RESPONSE VAL => ', JSON.stringify(responseVal));

            return resolve(responseVal);
        } catch (err) {
            Logger.write.log('error', 'Generate api request error for: ' + url + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to generate request' });
        }
    });
};

const updateAccountSubclassification = (id, code, name, aliasName, classification, cashFlowType) => {
    return new Promise(async (resolve, reject) => {
        // URL
        const url = '/api/account_subclassifications/' + id;

        // Payloads Data Body
        const data = {
            code: code,                             // MAX 9 DIGIT
            name: name,                             // MAX 40 CHAR  | Required.
            alias_name: aliasName,                  // MAX 40 CHAR
            classification: classification,         // 36 CHAR      | Required.
            cash_flow_type: cashFlowType            // 1 Integer    | 0 : Undifinied, 1 : Operating Activities, 2 : Investing Activities, 3 : Financing Activities.
        };

        try {
            const responseBody = await __request('PUT', url, data);
            const responseVal = JSON.parse(responseBody);

            // console.log('RESPONSE VAL => ', JSON.stringify(responseVal));

            return resolve(responseVal);
        } catch (err) {
            Logger.write.log('error', 'Generate api request error for: ' + url + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to generate request' });
        }
    });
};

const deleteAccountSubclassification = (id) => {
    return new Promise(async (resolve, reject) => {
        // URL
        const url = '/api/account_subclassifications/' + id;

        // Payloads Data Body
        const data = {};

        try {
            const responseBody = await __request('DELETE', url, data);
            const responseVal = JSON.parse(responseBody);

            // console.log('RESPONSE VAL => ', JSON.stringify(responseVal));

            return resolve(responseVal);
        } catch (err) {
            Logger.write.log('error', 'Generate api request error for: ' + url + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to generate request' });
        }
    });
};

/**
 **** ================================================================================================ ***
 */



/**
 **** =========================== ACCOUNT CLASSIFICATION ============================================= ***
 */
const getAccountClassification = () => {
    return new Promise(async (resolve, reject) => {
        // URL
        const url = '/api/account_classifications';

        // Payloads Data Body
        const data = {};

        try {
            const responseBody = await __request('GET', url, data);
            const responseVal = JSON.parse(responseBody);

            // console.log('RESPONSE VAL => ', JSON.stringify(responseVal));

            return resolve(responseVal);
        } catch (err) {
            Logger.write.log('error', 'Generate api request error for: ' + url + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to generate request' });
        }
    });
};

const updateAccountClassification = (id, name, aliasName) => {
    return new Promise(async (resolve, reject) => {
        // URL
        const url = '/api/account_classifications/' + id;

        // Payloads Data Body
        const data = {
            name: name,                             // MAX 40 CHAR  | Required.
            alias_name: aliasName                   // MAX 40 CHAR
        };

        try {
            const responseBody = await __request('PUT', url, data);
            const responseVal = JSON.parse(responseBody);

            // console.log('RESPONSE VAL => ', JSON.stringify(responseVal));

            return resolve(responseVal);
        } catch (err) {
            Logger.write.log('error', 'Generate api request error for: ' + url + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to generate request' });
        }
    });
};
/**
 **** ================================================================================================ ***
 */



/**
 **** =========================== CONTACTS =========================================================== ***
 */
const insertContacs = (code, name, currency, address1, address2, city, country, postcode, addressB1, addressB2, cityB, countryB, postcodeB, telp1, telp2, fax, email, webpages, contact, note, handphone, position, creditLimit, termType, discountDays, dueDays, earlyDiscount, lateCharge, homePage, notes, contact2, contact3, commission, useCommissionTable, age, sex) => {
    return new Promise(async (resolve, reject) => {
        // URL
        const url = '/api/contact';

        // Payloads Data Body
        const data = {
            code: code,//--------------------------------------------------------> // Char      : Max 25    | Reqiured
            name: name,//--------------------------------------------------------> // Char      : Max 100   | Required
            currency: currency,//------------------------------------------------> // Char      : Max 3     | Required
            address1: address1,//------------------------------------------------> // Char      : Max 100
            address2: address2,//------------------------------------------------> // Char      : Max 100
            city: city,//--------------------------------------------------------> // Char      : Max 25
            country: country,//--------------------------------------------------> // Char      : Max 80
            postcode: postcode,//------------------------------------------------> // Char      : Max 20
            addressb1: addressB1,//----------------------------------------------> // Char      : Max 100
            addressb2: addressB2,//----------------------------------------------> // Char      : Max 100
            cityb: cityB,//------------------------------------------------------> // Char      : Max 25
            countryb: countryB,//------------------------------------------------> // Char      : Max 80
            postcodeb: postcodeB,//----------------------------------------------> // Char      : Max 20
            telp1: telp1,//------------------------------------------------------> // Char      : Max 25
            telp2: telp2,//------------------------------------------------------> // Char      : Max 25
            fax: fax,//----------------------------------------------------------> // Char      : Max 30
            email: email,//------------------------------------------------------> // Char      : Max 60
            webpages: webpages,//------------------------------------------------> // Char      : Max 60
            contact: contact,//--------------------------------------------------> // Char      : Max 25
            note: note,//--------------------------------------------------------> // Char      : Max 255
            handphone: handphone,//----------------------------------------------> // Char      : Max 30
            position: position,//------------------------------------------------> // Char      : Max 20
            credit_limit: creditLimit,//-----------------------------------------> // Number
            termtype: termType,//------------------------------------------------> // Integer   :           | Default 0
            discountdays: discountDays,//----------------------------------------> // Integer
            duedays: dueDays,//--------------------------------------------------> // Integer
            earlydiscount: earlyDiscount,//--------------------------------------> // Integer
            latecharge: lateCharge,//--------------------------------------------> // Integer
            homepage: homePage,//------------------------------------------------> // Char      : Max 25
            notes: notes,//------------------------------------------------------> // Char
            contact2: contact2,//------------------------------------------------> // Char      : Max 25
            contact3: contact3,//------------------------------------------------> // Char      : Max 25
            commission: commission,//--------------------------------------------> // Contact Comission :   | Default 0
            use_commission_table: useCommissionTable,//--------------------------> // Contact Comission Table : Default T
            age: age,//----------------------------------------------------------> // Char      :           | Default null
            sex: sex//-----------------------------------------------------------> // Char      :           | Default null
        };

        try {
            const responseBody = await __request('POST', url, data);
            const responseVal = JSON.parse(responseBody);

            // console.log('RESPONSE VAL => ', JSON.stringify(responseVal));

            return resolve(responseVal);
        } catch (err) {
            Logger.write.log('error', 'Generate api request error for: ' + url + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to generate request' });
        }
    });
};
/**
 **** ================================================================================================ ***
 */




/**
 **** =========================== PRODUCTS =========================================================== ***
 */
const insertProducts = (code, name, category, aliasCode, aliasName, unitCost, unitPrice, unit, purchaseTax, salesTax, length, width, height, weight, note, mainSupplier, isTrackedAsInventory, isPurchased, isSold, inventoryAccount, cogsAccount, salesAccount, department, isActive) => {
    return new Promise(async (resolve, reject) => {
        // URL
        const url = '/api/products';

        // Payloads Data Body
        const data = {
            code: code,//--------------------------------------------------------> // Integer   : Max 100   | Reqiured
            name: name,//--------------------------------------------------------> // Char      : Max 250   | Required
            category: category,//------------------------------------------------> // Char      : Max 36    | Required
            alias_code: aliasCode,//---------------------------------------------> // Char      : Max 100
            alias_name: aliasName,//---------------------------------------------> // Char      : Max 250
            unit_cost: unitCost,//-----------------------------------------------> // Number
            unit_price: unitPrice,//---------------------------------------------> // Number
            unit: unit,//--------------------------------------------------------> // Char      : Max 36    | ID From Units
            purchase_tax: purchaseTax,//-----------------------------------------> // Char      : Max 36    | ID From Taxes
            sales_tax: salesTax,//-----------------------------------------------> // Char      : Max 36    | ID From Taxes
            length: length,//----------------------------------------------------> // Number
            width: width,//------------------------------------------------------> // Number
            height: height,//----------------------------------------------------> // Number
            weight: weight,//----------------------------------------------------> // Number
            note: note,//--------------------------------------------------------> // Char      : Max 255
            main_supplier: mainSupplier,//---------------------------------------> // Char      : Max 36    | ID From Contacts
            is_tracked_as_inventory: isTrackedAsInventory,//---------------------> // Boolean               | Default True
            is_purchased: isPurchased,//-----------------------------------------> // Boolean               | Default True
            is_sold: isSold,//---------------------------------------------------> // Boolean               | Default True
            inventory_account: inventoryAccount,//-------------------------------> // Char      : Max 36    | ID From Contacts
            cogs_account: cogsAccount,//-----------------------------------------> // Char      : Max 36    | ID From Contacts
            sales_account: salesAccount,//---------------------------------------> // Char      : Max 36    | ID From Contacts
            department: department,//--------------------------------------------> // Char      : Max 36    | ID From Departement
            is_active: isActive//------------------------------------------------> // Boolean               | Default True
        };

        try {
            const responseBody = await __request('POST', url, data);
            const responseVal = JSON.parse(responseBody);

            // console.log('RESPONSE VAL => ', JSON.stringify(responseVal));

            return resolve(responseVal);
        } catch (err) {
            Logger.write.log('error', 'Generate api request error for: ' + url + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to generate request' });
        }
    });
};
/**
 **** ================================================================================================ ***
 */




/**
 **** =========================== PRODUCTS CATEGORIES ================================================ ***
 */
const insertProductCategories = (name, isTrackedAsInventory, isPurchasable, isSalable, inventoryAccount, cogsAccount, salesAccount, department, isCreateAccount) => {
    return new Promise(async (resolve, reject) => {
        // URL
        const url = '/api/product_categories';

        // Payloads Data Body
        const data = {
            name: name,//--------------------------------------------------------> // Char      : Max 50    | Required
            is_tracked_as_inventory: isTrackedAsInventory,//---------------------> // Boolean
            is_purchasable: isPurchasable,//-------------------------------------> // Boolean
            is_salable: isSalable,//---------------------------------------------> // Boolean
            inventory_account: inventoryAccount,//-------------------------------> // Char      : Max 36    | ID From Accounts
            cogs_account: cogsAccount,//-----------------------------------------> // Char      : Max 36    | ID From Accounts
            sales_account: salesAccount,//---------------------------------------> // Char      : Max 36    | ID From Accounts
            department: department,//--------------------------------------------> // Char      : Max 36    | ID From Departement
            is_create_account: isCreateAccount//---------------------------------> // Boolean
        };

        try {
            const responseBody = await __request('POST', url, data);
            const responseVal = JSON.parse(responseBody);

            // console.log('RESPONSE VAL => ', JSON.stringify(responseVal));

            return resolve(responseVal);
        } catch (err) {
            Logger.write.log('error', 'Generate api request error for: ' + url + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to generate request' });
        }
    });
};
/**
 **** ================================================================================================ ***
 */



/**
 **** =========================== UNITS ============================================================== ***
 */
const insertUnits = (code, name, description, isBase) => {
    return new Promise(async (resolve, reject) => {
        // URL
        const url = '/api/units';

        // Payloads Data Body
        const data = {
            code: code,//--------------------------------------------------------> // Char      : Max 15
            name: name,//--------------------------------------------------------> // Char      : Max 25    | Required
            description: description,//------------------------------------------> // Char      : Max 225
            is_base: isBase//----------------------------------------------------> // Boolean
        };

        try {
            const responseBody = await __request('POST', url, data);
            const responseVal = JSON.parse(responseBody);

            // console.log('RESPONSE VAL => ', JSON.stringify(responseVal));

            return resolve(responseVal);
        } catch (err) {
            Logger.write.log('error', 'Generate api request error for: ' + url + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to generate request' });
        }
    });
};
/**
 **** ================================================================================================ ***
 */



/**
 **** =========================== TAXES ============================================================== ***
 */
const insertTaxes = (code, name, percentage, purchaseTaxAccount, saleTaxAccount) => {
    return new Promise(async (resolve, reject) => {
        // URL
        const url = '/api/taxes';

        // Payloads Data Body
        const data = {
            code: code,//--------------------------------------------------------> // Char      : Max 10
            name: name,//--------------------------------------------------------> // Char      : Max 55    | Required
            percentage: percentage,//--------------------------------------------> // Number
            purchase_tax_account: purchaseTaxAccount,//--------------------------> // Char      : Max 36    | ID From Accounts
            sale_tax_account: saleTaxAccount//-----------------------------------> // Char      : Max 36    | ID From Accounts
        };

        try {
            const responseBody = await __request('POST', url, data);
            const responseVal = JSON.parse(responseBody);

            // console.log('RESPONSE VAL => ', JSON.stringify(responseVal));

            return resolve(responseVal);
        } catch (err) {
            Logger.write.log('error', 'Generate api request error for: ' + url + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to generate request' });
        }
    });
};
/**
 **** ================================================================================================ ***
 */



/**
 **** =========================== WAREHOUSES ========================================================= ***
 */
const insertWarehouse = (code, name, address1, address2, city, country, postalCode, notes, isContainer, containerDimension, isActive) => {
    return new Promise(async (resolve, reject) => {
        // URL
        const url = '/api/warehouses';

        // Payloads Data Body
        const data = {
            code: code,//--------------------------------------------------------> // Char      : Max 15
            name: name,//--------------------------------------------------------> // Char      : Max 255   | Required
            address_1: address1,//-----------------------------------------------> // Char      : Max 100
            address_2: address2,//-----------------------------------------------> // Char      : Max 100
            city: city,//--------------------------------------------------------> // Char      : Max 25
            country: country,//--------------------------------------------------> // Char      : Max 80
            postal_code: postalCode,//-------------------------------------------> // Char      : Max 10
            notes: notes,//------------------------------------------------------> // Char      : Max 255
            is_container: isContainer,//-----------------------------------------> // Boolean
            container_dimension: containerDimension,//---------------------------> // Number
            is_active: isActive//------------------------------------------------> // Boolean
        };

        try {
            const responseBody = await __request('POST', url, data);
            const responseVal = JSON.parse(responseBody);

            // console.log('RESPONSE VAL => ', JSON.stringify(responseVal));

            return resolve(responseVal);
        } catch (err) {
            Logger.write.log('error', 'Generate api request error for: ' + url + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to generate request' });
        }
    });
};
/**
 **** ================================================================================================ ***
 */



/**
 **** =========================== DEPARTMENTS ======================================================== ***
 */
const insertDepartments = (code, name, manager, parentDepartment, field, notes) => {
    return new Promise(async (resolve, reject) => {
        // URL
        const url = '/api/departments';

        // Payloads Data Body
        const data = {
            code: code,//--------------------------------------------------------> // Char      : Max 15    | Required
            name: name,//--------------------------------------------------------> // Char      : Max 35    | Required
            manager: manager,//--------------------------------------------------> // Char      : Max 36    | ID From Contact
            parent_department: parentDepartment,//-------------------------------> // Char      : Max 36    | ID From Departments
            field: field,//------------------------------------------------------> // Char      : Max 35
            notes: notes//-------------------------------------------------------> // Char      : Max 255
        };

        try {
            const responseBody = await __request('POST', url, data);
            const responseVal = JSON.parse(responseBody);

            // console.log('RESPONSE VAL => ', JSON.stringify(responseVal));

            return resolve(responseVal);
        } catch (err) {
            Logger.write.log('error', 'Generate api request error for: ' + url + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to generate request' });
        }
    });
};
/**
 **** ================================================================================================ ***
 */



/**
 **** =========================== PROJECTS =========================================================== ***
 */
const insertProjects = (code, name, description, orderNumber, orderDate, completionDueDate, startDate, endDate, customer, contactPerson, manager, status, isJobOrder, isUsePhase, percentage, isActive) => {
    return new Promise(async (resolve, reject) => {
        // URL
        const url = '/api/projects';

        // Payloads Data Body
        const data = {
            code: code,//--------------------------------------------------------> // Char      : Max 25
            name: name,//--------------------------------------------------------> // Char      : Max 50    | Required
            description: description,//------------------------------------------> // Char      : Max 255
            order_number: orderNumber,//-----------------------------------------> // Char      : Max 35
            order_date: orderDate,//---------------------------------------------> // Date                  | YYYY-MM-DD
            completion_due_date: completionDueDate,//----------------------------> // Date                  | YYYY-MM-DD
            start_date: startDate,//---------------------------------------------> // Date                  | YYYY-MM-DD
            end_date: endDate,//-------------------------------------------------> // Date                  | YYYY-MM-DD
            customer: customer,//------------------------------------------------> // Char      : Max 36    | ID From Contacts
            contact_person: contactPerson,//-------------------------------------> // Char      : Max 35
            manager: manager,//--------------------------------------------------> // Char      : Max 36    | ID From Contacts
            status: status,//----------------------------------------------------> // Char      : Max 36    | ID From Contacts
            is_job_order: isJobOrder,//------------------------------------------> // Boolean
            is_use_phase: isUsePhase,//------------------------------------------> // Boolean
            percentage: percentage,//--------------------------------------------> // Number
            is_active: isActive//------------------------------------------------> // Boolean
        };

        try {
            const responseBody = await __request('POST', url, data);
            const responseVal = JSON.parse(responseBody);

            // console.log('RESPONSE VAL => ', JSON.stringify(responseVal));

            return resolve(responseVal);
        } catch (err) {
            Logger.write.log('error', 'Generate api request error for: ' + url + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to generate request' });
        }
    });
};
/**
 **** ================================================================================================ ***
 */



/**
 **** =========================== PROJECTS STATUSES ================================================== ***
 */
const insertProjectStatuses = (name, description) => {
    return new Promise(async (resolve, reject) => {
        // URL
        const url = '/api/project_statuses';

        // Payloads Data Body
        const data = {
            name: name,//--------------------------------------------------------> // Char      : Max 35    | Required
            description: description//-------------------------------------------> // Char      : Max 225
        };

        try {
            const responseBody = await __request('POST', url, data);
            const responseVal = JSON.parse(responseBody);

            // console.log('RESPONSE VAL => ', JSON.stringify(responseVal));

            return resolve(responseVal);
        } catch (err) {
            Logger.write.log('error', 'Generate api request error for: ' + url + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to generate request' });
        }
    });
};
/**
 **** ================================================================================================ ***
 */



/**
 **** =========================== POS PAYMENT METHODS ================================================ ***
 */
const insertPosPaymentMethods = (code, name, manager, parentDepartment, field, notes) => {
    return new Promise(async (resolve, reject) => {
        // URL
        const url = '/api/project_statuses';

        // Payloads Data Body
        const data = {
            code: code,//--------------------------------------------------------> // Char      : Max 15    | Required
            name: name,//--------------------------------------------------------> // Char      : Max 35    | Required
            manager: manager,//--------------------------------------------------> // Char      : Max 36    | ID From Contact
            parent_department: parentDepartment,//-------------------------------> // Char      : Max 36    | ID From Departments
            field: field,//------------------------------------------------------> // Char      : Max 35
            notes: notes//-------------------------------------------------------> // Char      : Max 225
        };

        try {
            const responseBody = await __request('POST', url, data);
            const responseVal = JSON.parse(responseBody);

            // console.log('RESPONSE VAL => ', JSON.stringify(responseVal));

            return resolve(responseVal);
        } catch (err) {
            Logger.write.log('error', 'Generate api request error for: ' + url + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to generate request' });
        }
    });
};
/**
 **** ================================================================================================ ***
 */



/**
 **** =========================== BEGINNING BALANCES ================================================= ***
 */
const insertReceivableBeginningBalances = (invoiceNumber, invoiceDate, description, salesOrder, customer, salesman, department, project, currency, dueDaysTOP, lateChargeTOP, discountDaysTOP, earlyDiscountTOP, numberDoc, dateDoc, accountReceiv, amountReceiv) => {
    return new Promise(async (resolve, reject) => {
        // URL
        const url = '/api/receivable_beginning_balances';

        // Payloads Data Body
        const data = {
            invoice_number: invoiceNumber,//-------------------------------------> // Char      : Max 35    | Required
            invoice_date: invoiceDate,//-----------------------------------------> // Date      : YYYY-MM-DD| Required
            description: description,//------------------------------------------> // Char      : Max 75
            sales_order: salesOrder,//-------------------------------------------> // Char                  | ID From Sales Order
            customer: customer,//------------------------------------------------> // Char                  | ID From Customer      | Required
            salesman: salesman,//------------------------------------------------> // Char                  | ID From Salesman
            department: department,//--------------------------------------------> // Char                  | ID From Department
            project: project,//--------------------------------------------------> // Char                  | ID From Project
            currency: currency,//------------------------------------------------> // Char                  | ID From Currency
            term_of_payment: {
                due_days: dueDaysTOP,//------------------------------------------> // Integer
                late_charge: lateChargeTOP,//------------------------------------> // Number
                discount_days: discountDaysTOP,//--------------------------------> // Integer
                early_discount: earlyDiscountTOP//-------------------------------> // Number
            },
            document: {
                number: numberDoc,//---------------------------------------------> // Char      : Max 25
                date: dateDoc//--------------------------------------------------> // Date                  | YYYY-MM-DD
            },
            receivable: {
                account: accountReceiv,//----------------------------------------> // Char                  | ID From Receivable Account
                amount: amountReceiv//-------------------------------------------> // Number                | Required
            }
        };

        try {
            const responseBody = await __request('POST', url, data);
            const responseVal = JSON.parse(responseBody);

            // console.log('RESPONSE VAL => ', JSON.stringify(responseVal));

            return resolve(responseVal);
        } catch (err) {
            Logger.write.log('error', 'Generate api request error for: ' + url + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to generate request' });
        }
    });
};
/**
 **** ================================================================================================ ***
 */



/**
 **** =========================== PAYABLE BEGINNING BALANCES ========================================= ***
 */
const insertPayableBeginningBalances = (invoiceNumber, invoiceDate, description, purchaseOrders, supplier, employee, department, project, currency, dueDaysTOP, lateChargeTOP, discountDaysTOP, earlyDiscountTOP, numberDoc, dateDoc, accountPay, amountPay) => {
    return new Promise(async (resolve, reject) => {
        // URL
        const url = '/api/payable_beginning_balances';

        // Payloads Data Body
        const data = {
            invoice_number: invoiceNumber,//-------------------------------------> // Char      : Max 35    | Required
            invoice_date: invoiceDate,//-----------------------------------------> // Date      : YYYY-MM-DD| Required
            description: description,//------------------------------------------> // Char      : Max 75
            purchase_orders: purchaseOrders,//-----------------------------------> // Char                  | ID From Purchase Order
            supplier: supplier,//------------------------------------------------> // Char                  | ID From Supplier      | Required
            employee: employee,//------------------------------------------------> // Char                  | ID From Employee
            department: department,//--------------------------------------------> // Char                  | ID From Department
            project: project,//--------------------------------------------------> // Char                  | ID From Project
            currency: currency,//------------------------------------------------> // Char                  | ID From Currency
            term_of_payment: {
                due_days: dueDaysTOP,//------------------------------------------> // Integer
                late_charge: lateChargeTOP,//------------------------------------> // Number
                discount_days: discountDaysTOP,//--------------------------------> // Integer
                early_discount: earlyDiscountTOP//-------------------------------> // Number
            },
            document: {
                number: numberDoc,//---------------------------------------------> // Char      : Max 25
                date: dateDoc//--------------------------------------------------> // Date                  | YYYY-MM-DD
            },
            payable: {
                account: accountPay,//-------------------------------------------> // Char                  | ID From Payable Account
                amount: amountPay//----------------------------------------------> // Number                | Required
            }
        };

        try {
            const responseBody = await __request('POST', url, data);
            const responseVal = JSON.parse(responseBody);

            // console.log('RESPONSE VAL => ', JSON.stringify(responseVal));

            return resolve(responseVal);
        } catch (err) {
            Logger.write.log('error', 'Generate api request error for: ' + url + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to generate request' });
        }
    });
};
/**
 **** ================================================================================================ ***
 */



/**
 **** =========================== SALES QUOTATIONS =================================================== ***
 */
const insertSalesQuotations = (id, quotationNumber, quotationDate, validityDate, isFinished, description, customer, salesman, department, project, warehouse, currency, isCash, dueDaysTOP, lateChargeTOP, discountDaysTOP, earlyDiscountTOP , numberDoc, dateDoc, idLineItems, productLineItems, accountLineItems, descriptionLineItems, notesLineItems, quantityLineItems, unitLineItems, unitPriceLineItems, discountLineItems, taxLineItems, departmentLineItems, projectLineItems , accountOthers, amountOthers, accountTotal, amountTotal) => {
    return new Promise(async (resolve, reject) => {
        // URL
        const url = '/api/sales_quotation';

        // Payloads Data Body
        const data = {
            id: id,//------------------------------------------------------------> // Char      : Max 35    | Required
            quotation_number: quotationNumber,//---------------------------------> // Date      : YYYY-MM-DD| Required
            quotation_date: quotationDate,//-------------------------------------> // Char      : Max 75
            validity_date: validityDate,//---------------------------------------> // Char                  | ID From Purchase Order
            is_finished: isFinished,//-------------------------------------------> // Char                  | ID From Supplier      | Required
            description: description,//------------------------------------------> // Char                  | ID From Employee
            customer: customer,//------------------------------------------------> // Char                  | ID From Department
            salesman: salesman,//------------------------------------------------> // Char                  | ID From Project
            department: department,//--------------------------------------------> // Char                  | ID From Currency
            project: project,//--------------------------------------------------> // Char                  | ID From Currency
            warehouse: warehouse,//----------------------------------------------> // Char                  | ID From Currency
            currency: currency,//------------------------------------------------> // Char                  | ID From Currency
            is_cash: isCash,//---------------------------------------------------> // Char                  | ID From Currency
            term_of_payment: {
                due_days: dueDaysTOP,//------------------------------------------> // Integer
                late_charge: lateChargeTOP,//------------------------------------> // Number
                discount_days: discountDaysTOP,//--------------------------------> // Integer
                early_discount: earlyDiscountTOP//-------------------------------> // Number
            },
            document: {
                number: numberDoc,//---------------------------------------------> // Char      : Max 25
                date: dateDoc//--------------------------------------------------> // Date                  | YYYY-MM-DD
            },
            line_items: {
                id: idLineItems,//-----------------------------------------------> // Char      : Max 36
                product: productLineItems,//-------------------------------------> // Char                  | ID From Product
                account: accountLineItems,//-------------------------------------> // Char                  | Sales Account
                description: descriptionLineItems,//-----------------------------> // Char      : Max 255
                notes: notesLineItems,//-----------------------------------------> // Char      : Max 255
                quantity: quantityLineItems,//-----------------------------------> // Number
                unit: unitLineItems,//-------------------------------------------> // Char                  | ID From Unit
                unit_price: unitPriceLineItems,//--------------------------------> // Number
                discount: discountLineItems,//-----------------------------------> // Number
                tax: taxLineItems,//---------------------------------------------> // Char                  | ID From Tax
                department: departmentLineItems,//-------------------------------> // Char                  | ID From Department
                project: projectLineItems//--------------------------------------> // Char                  | ID From Project
            },
            others: {
                account: accountOthers,//----------------------------------------> // Char                  | ID From Other Account
                amount: amountOthers//-------------------------------------------> // Number
            },
            total: {
                account: accountTotal,//-----------------------------------------> // Char                  | ID From Total Account
                amount: amountTotal//--------------------------------------------> // Number
            }
        };

        try {
            const responseBody = await __request('POST', url, data);
            const responseVal = JSON.parse(responseBody);

            // console.log('RESPONSE VAL => ', JSON.stringify(responseVal));

            return resolve(responseVal);
        } catch (err) {
            Logger.write.log('error', 'Generate api request error for: ' + url + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to generate request' });
        }
    });
};
/**
 **** ================================================================================================ ***
 */

module.exports = {
    getAccount,
    getAccountSubclassification,
    getAccountClassification,
    insertAccount,
    insertAccountSubclassification,
    insertContacs,
    insertProducts,
    insertProductCategories,
    insertUnits,
    insertTaxes,
    insertWarehouse,
    insertDepartments,
    insertProjects,
    insertProjectStatuses,
    insertPosPaymentMethods,
    insertReceivableBeginningBalances,
    insertPayableBeginningBalances,
    insertSalesQuotations,
    updateAccount,
    updateAccountSubclassification,
    updateAccountClassification,
    deleteAccount,
    deleteAccountSubclassification
};

const FormData = require('../model/formData');

const selectDropdownData = () => {
    return new Promise((resolve, reject) => {
        const dropdownJson = __selectDropdown();
        try {
            return resolve(dropdownJson);
        } catch (err) {
            return reject({ 'err.message': err });
        }
    });
};

const __selectDropdown = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const education = await FormData.getEducation();
            const job = await FormData.getJob();
            const jobDuration = await FormData.getJobDuration();
            const jobSector = await FormData.getJobSector();
            const maritalStatus = await FormData.getMaritalStatus();
            const revenue = await FormData.getRevenue();
            const bank = await FormData.getBank();
            const title = await FormData.getTitle();
            const religion = await FormData.getReligion();
            const sourceFund = await FormData.getSourceFund();
            const dropdown = __merge(education, job, jobDuration, jobSector, maritalStatus, revenue, bank, title, religion, sourceFund);
            return resolve(dropdown);
        } catch (err) {
            return reject(err);
        }
    });
};

const __merge = (education, job, jobDuration, jobSector, maritalStatus, revenue, bank, title, religion, sourceFund) => {
    return new Promise((resolve, reject) => {
        try {
            return resolve(
                { 'education': education, 'job': job, 'jobDuration': jobDuration, 'jobSector': jobSector, 'maritalStatus': maritalStatus, 'revenue': revenue, 'bank': bank, 'title': title, 'religion': religion, 'sourceFund': sourceFund }
            );
        } catch (err) {
            return reject({ 'err.message': err });
        }
    });
};

const selectDropdownCorporateData = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const companyDuration = await FormData.getCompanyDuration();
            const companyEmployee = await FormData.getCompanyEmployee();
            const companySector = await FormData.getCompanySector();
            const bank = await FormData.getBank();
            return resolve(
                {
                    'companyDuration': companyDuration,
                    'companyEmployee': companyEmployee,
                    'companySector': companySector,
                    'bank': bank
                }
            );
        } catch (err) {
            return reject(err);
        }
    });
};

module.exports = {
    selectDropdownData,
    selectDropdownCorporateData
};

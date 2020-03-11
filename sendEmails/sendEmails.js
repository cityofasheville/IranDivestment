const pug = require('pug');
const path = require('path');
const ses_sendemail = require('./ses_sendemail');

const compiledFunction = pug.compileFile(path.join(__dirname, '/email.pug'));

function sendEmails(listOfVendors) {
    let emailAddrs = JSON.parse(process.env.EMAIL_RECIPIENT_JSON);
    let pugObj = {};
    pugObj.listOfVendors = listOfVendors;
    let htmlEmail = compiledFunction(pugObj);
    ses_sendemail(emailAddrs,htmlEmail);
}

module.exports = sendEmails;
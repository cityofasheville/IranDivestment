const pug = require('pug');
const path = require('path');
const ses_sendemail = require('./ses_sendemail');

const compiledFunction = pug.compileFile(path.join(__dirname, '/email.pug'));

// listOfVendors[0].a_vendor_id,
// listOfVendors[0].a_vendor_name,
// listOfVendors[0].a_vend_alpha_sort,
// listOfVendors[0].v_dba,
// listOfVendors[0].keyword

function sendEmails(listOfVendors) { // console.log(listOfVendors) a_vendor_id, a_vendor_name, a_vend_alpha_sort, v_dba, keyword
    let emailAddr = 'jtwilson@ashevillenc.gov';
    let pugObj = {};
    pugObj.listOfVendors = listOfVendors;
    let htmlEmail = compiledFunction(pugObj);
    // console.log(htmlEmail)
    ses_sendemail(emailAddr,htmlEmail);
}

module.exports = sendEmails;
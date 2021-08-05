const pug = require('pug');
const path = require('path');
const ses_sendemail = require('./ses_sendemail');

const compiledFunction = pug.compileFile(path.join(__dirname, '/email.pug'));

function sendEmails(listOfVendors) {
    return new Promise(async (resolve,reject)=>{
        try{
            let emailAddrs = JSON.parse(process.env.EMAIL_RECIPIENT_JSON);
            let pugObj = {};
            pugObj.listOfVendors = listOfVendors;
            let htmlEmail = compiledFunction(pugObj);

            let ret = await ses_sendemail(emailAddrs,htmlEmail);
            resolve(ret)
        }catch(err) { reject(err) }     
    })

}

module.exports = sendEmails;
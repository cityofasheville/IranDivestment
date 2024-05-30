import { compileFile } from 'pug';
import { join } from 'path';
import ses_sendemail from './ses_sendemail.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
// import "dotenv/config.js";

const __dirname = dirname(fileURLToPath(import.meta.url)); // current directory

const compiledFunction = compileFile(join(__dirname, '/email.pug'));

function sendEmails (listOfVendors) {
  return new Promise(async (resolve, reject) => {
    try {
      const emailAddrs = JSON.parse(process.env.EMAIL_RECIPIENT_JSON);
      const pugObj = {};
      pugObj.listOfVendors = listOfVendors;
      const htmlEmail = compiledFunction(pugObj);

      const ret = await ses_sendemail(emailAddrs, htmlEmail);
      console.log('Email sent:', process.env.EMAIL_RECIPIENT_JSON);
      resolve(ret);
    } catch (err) { reject(err); }
  })
}

export default sendEmails

const pug = require('pug')
const path = require('path')
const ses_sendemail = require('./ses_sendemail')

const compiledFunction = pug.compileFile(path.join(__dirname, '/email.pug'))

function sendEmails (listOfVendors) {
  return new Promise(async (resolve, reject) => {
    try {
      const emailAddrs = JSON.parse(process.env.EMAIL_RECIPIENT_JSON)
      const pugObj = {}
      pugObj.listOfVendors = listOfVendors
      const htmlEmail = compiledFunction(pugObj)

      const ret = await ses_sendemail(emailAddrs, htmlEmail)
      resolve(ret)
    } catch (err) { reject(err) }
  })
}

module.exports = sendEmails

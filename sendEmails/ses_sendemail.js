let AWS = require('aws-sdk');
require('dotenv').config();

var credentials = new AWS.SharedIniFileCredentials({profile: 'notifications-email'}); //reads ~/.aws/credentials for local creds
AWS.config.update({region: 'us-east-1', credentials});

let params = {
  Destination: { /* required */
    ToAddresses: []
  },
  Message: { /* required */
    Body: { /* required */
      Html: {
       Charset: "UTF-8",
       Data: ""
      },
      Text: {
       Charset: "UTF-8",
       Data: ""
      }
     },
     Subject: {
      Charset: 'UTF-8',
      Data: 'City of Asheville Iran Divestment'
     }
    },
  Source: process.env.EMAIL_SENDER, /* required */
  ReplyToAddresses: [
     process.env.EMAIL_SENDER,
  ],
};

function ses_sendemail(emailAddrs, htmlEmail){
    params.Destination.ToAddresses = emailAddrs;
    params.Message.Body.Html.Data = htmlEmail;
    params.Message.Body.Text.Data = htmlEmail; //TODO: plain text
   
    // Create the promise and SES service object
    let sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
    
    // Handle promise's fulfilled/rejected states
    sendPromise.then(
    function(data) {
        console.log(data.MessageId);
    }).catch(
        function(err) {
        console.error(err, err.stack);
    });
}

module.exports = ses_sendemail;

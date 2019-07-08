const {google} = require('googleapis');
let checkForMatches = require('./checkForMatches');

let privatekey = 
{
  "type": process.env.key_type,
  "project_id": process.env.project_id,
  "private_key_id": process.env.private_key_id,
  "private_key": process.env.private_key,
  "client_email": process.env.client_email,
  "client_id": process.env.client_id,
  "auth_uri": process.env.auth_uri,
  "token_uri": process.env.token_uri,
  "auth_provider_x509_cert_url": process.env.auth_provider_x509_cert_url,
  "client_x509_cert_url": process.env.client_x509_cert_url
};

console.log(privatekey);



exports.handler = (event, context, callback) => {
  // configure a JWT auth client
  let jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ['https://www.googleapis.com/auth/spreadsheets.readonly']);
  //authenticate request
  jwtClient.authorize(function (err, tokens) {
    if (err) {
      console.log(err);
      return;
    }
    try {
      getDivestmentData(jwtClient).then(divestment_vendors=>{
        console.log(divestment_vendors);
        // getApproved(jwtClient).then(approved_vendors=>{
        //   checkForMatches(approved_vendors,divestment_vendors);
        // });
      });
    } catch (err) {
      console.error(err);
    }
  });
}

function getDivestmentData(auth) {
  return new Promise(function(resolve, reject) {
    let spreadsheetId = process.env.spreadsheetid;
    let range = 'Bad Actors!A5:B';
    let sheets = google.sheets('v4');
    sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range
    }, function (err, response) { //console.log("response", response);
      if (err) {
        reject(new Error('The API returned an error: ' + err));
      }         
      const divestment_vendors = response.data.values;
      if (divestment_vendors) {
        resolve(divestment_vendors);
      } else {
        reject(new Error('No data found.'));
      }
    });
  });
}

function getApproved(auth) {
  return new Promise(function(resolve, reject) {
    let spreadsheetId = process.env.spreadsheetid;
    let range = 'Approved Companies!A6:B';
    let sheets = google.sheets('v4');
    sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range
    }, function (err, response) {
      if (err) {
          reject(new Error('The API returned an error: ' + err));
      }         
      const approved_vendors = response.data.values;
      if (approved_vendors) {
        resolve(approved_vendors);
      } else {
        resolve(null);
      }
    });
  });
}

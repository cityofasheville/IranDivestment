const {google} = require('googleapis');
let privatekey = require('./client_secret.json');
let loadDb = require('./loadDb');
require('dotenv').config();

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
});

try {
  getDivestmentData(jwtClient).then(divestment_vendors=>{
    getApproved(jwtClient).then(approved_vendors=>{
      loadDb(approved_vendors,divestment_vendors);
    });
  });
} catch (err) {
console.error(err);
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
    }, function (err, response) {
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

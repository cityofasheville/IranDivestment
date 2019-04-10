const fs = require('fs');
const util = require('util');
const readline = require('readline');
const {google} = require('googleapis');
const readFile = util.promisify(fs.readFile)
// Reads the Google Sheet https://docs.google.com/spreadsheets/d/1FOmrFm5afRc_XqTeF2T-ilWtZDIYzdqKiZlPX129IQA/edit
// Adapted from https://developers.google.com/sheets/api/quickstart/nodejs

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

async function read_sheet(){
  // Load client secrets from a local file.
  try {
    let content = await readFile('credentials.json');
    let rows = await authorize(JSON.parse(content));
    return listData(rows);
  } catch(err) {
    console.error(err);
  }
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * data from spreadsheet
 * @see https://docs.google.com/spreadsheets/d/1FOmrFm5afRc_XqTeF2T-ilWtZDIYzdqKiZlPX129IQA/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function listData(auth) {
  return new Promise(function(resolve, reject) {
    const sheets = google.sheets({version: 'v4', auth});
    sheets.spreadsheets.values.get({
      spreadsheetId: '1FOmrFm5afRc_XqTeF2T-ilWtZDIYzdqKiZlPX129IQA',
      range: 'Sheet1!A5:B',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      reject(err);
      const rows = res.data.values;
      if (rows.length) {
        resolve(rows.filter(row=>{row[0] && row[0] !== 'Subsidiaries'}))
        // Print columns A and B, which correspond to indices 0 and 1.
        // rows.map((row) => {
        //   if(row[0] && row[0] !== 'Subsidiaries'){
        //     console.log(`${row[0]}, ${row[1]}`);
        //   }
        // });
      } else {
        console.log('No data found.');
      }
    });
  })
}

module.exports = read_sheet;
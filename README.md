##Send Email if any vendor in Munis is listed in spreadsheet##

Script to automate the Iran Divestment Act (IDA) process for direct pay invoices greater than $1,000. Using this script obviates the need for departments and vendors to sign an IDA Form with their invoices.

Reads Iranian Vendors from the Google Sheet 
https://docs.google.com/spreadsheets/d/*spreadsheetid*/edit
And compares vendors Asheville currently uses. Sends email if found.

Second sheet also allows whitelisting of vendors by ID.

Enable Google Sheets API as described [here](https://developers.google.com/sheets/api/quickstart/nodejs). This will create files credentials.json, and after you run program once, the file token.json.



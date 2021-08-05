## Send Email if any vendor in Munis is listed in spreadsheet

Script to automate the Iran Divestment Act (IDA) process for direct pay invoices greater than $1,000. Using this script obviates the need for departments and vendors to sign an IDA Form with their invoices.

The list of Iranian Vendors is maintained in a Google Sheet 
https://docs.google.com/spreadsheets/d/*spreadsheetid*/edit
Bedrock loads spreadsheet (iran_divestment) and current vendors (vendors.lib) from Munis into MDAStore1 database.
This script compares them and sends email if found.

Second sheet also allows whitelisting of vendors by ID.

Enable Google Sheets API as described [here](https://developers.google.com/sheets/api/quickstart/nodejs). In the [Console](https://console.developers.google.com/apis), create a Service Account and download the json. Save it as client_secret.json in the program directory. Give permissions to the spreadsheet to the email address associated with the Service Account.

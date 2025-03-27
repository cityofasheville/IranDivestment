## Send Email if any vendor in Munis is listed in spreadsheet

Script to automate the Iran Divestment Act (IDA) process for direct pay invoices greater than $1,000. Using this script obviates the need for departments and vendors to sign an IDA Form with their invoices.

The list of Iranian Vendors is maintained in a Google Sheet 
https://docs.google.com/spreadsheets/d/*spreadsheetid*/edit
Bedrock loads spreadsheet (iran_divestment) and current vendors (vendors.lib) from Munis into MDAStore1 database.
This script compares them and sends email if found.

Second sheet also allows whitelisting of vendors by ID.

Enable Google Sheets API as described [here](https://developers.google.com/sheets/api/quickstart/nodejs). In the [Console](https://console.developers.google.com/apis), create a Service Account and download the json. Save it as client_secret.json in the program directory. Give permissions to the spreadsheet to the email address associated with the Service Account.


### Commands
First run ```npm install```

```package.json``` has these scripts:
- Test Locally: 
  - ```npm start``` (or for a Python program: ```npm run startpy```)
- Deploy: 
  - ```npm run deploy```
- Destroy: (removes all objects from AWS)
  - ```npm run destroy```
- Clean: 
  - ```npm run clean``` (removes local temp files)

The Deploy/Destroy commands use the name of the active GitHub branch when creating AWS resources.
For example, if the active GitHub branch is "feature" and the name of the resource is "template", the resource is named "template_feature". For API gateway domains, it's "feature-template.ashevillenc.gov". Production (or main) branches do not get a prefix/suffix.
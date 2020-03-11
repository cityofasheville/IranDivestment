## Send Email if any vendor in Munis is listed in spreadsheet

Script to automate the Iran Divestment Act (IDA) process for direct pay invoices greater than $1,000. Using this script obviates the need for departments and vendors to sign an IDA Form with their invoices.

The list of Iranian Vendors is maintained in a Google Sheet 
https://docs.google.com/spreadsheets/d/*spreadsheetid*/edit
Bedrock loads spreadsheet (iran_divestment.lib) and current vendors (vendors.lib) from Munis into Data Library.
This script compares them and sends email if found.

Second sheet also allows whitelisting of vendors by ID.


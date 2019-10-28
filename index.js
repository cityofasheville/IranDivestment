const { Client } = require('pg')
const Cursor = require('pg-cursor')
const {promisify} = require('util');
let sendEmails = require('./sendEmails/sendEmails');

require('dotenv').config();

//exports.handler = (event, context, callback) => {
(async function run() {
    let keyWordFound = [];          // vendors in our database containing a keyword in divestment list
    let divestmentVendors = [];      // vendors also not marked as approved.

    const client = new Client({
        host: process.env.libhost,
        user: process.env.libuser,
        password: process.env.libpassword,
        database: process.env.libdatabase,
        port: 5432,
    });
    await client.connect();

    let divestment_vendors = await client.query("SELECT parent_companies, key_search_words FROM r_finance.iranian_companies;")
    let approved_vendors = await client.query("SELECT vendor_name, vendor_id FROM r_finance.iran_approved_companies;");
    
    let [keyRegExs, approved_ids] = await cleanUpLists(approved_vendors.rows,divestment_vendors.rows);

    const cursor = client.query(
    new Cursor("select distinct a_vendor_id, a_vendor_name, a_vend_alpha_sort, v_dba from r_finance.vendors")
    );

    const promisifiedCursorRead = promisify(cursor.read.bind(cursor));

    const ROW_COUNT = 1000;
    while (true) {
        const result = await promisifiedCursorRead(ROW_COUNT);

        if (result.length === 0) {
            break;
        }

        result.forEach(vendor=>{ 
            keyRegExs.forEach(keyRegEx=>{
                if (keyRegEx.test(vendor.a_vendor_name) || keyRegEx.test(vendor.a_vend_alpha_sort) || keyRegEx.test(vendor.v_dba)) {
                    vendor.keyword = keyRegEx.toString().substring(1, keyRegEx.toString().length - 2);
                    keyWordFound.push(vendor);
                }
            })
        });
    }

    cursor.close(() => {
        client.end();
    });

    // see if found vendors are listed as ok
    keyWordFound.forEach(found1=>{
        if(!approved_ids.some(appr=>{// if the vendor we found with bad keywords is not in approved list
            return found1.a_vendor_id == appr; 
        })){
            divestmentVendors.push(found1);
        }    
    })
    sendEmails(divestmentVendors)

})(); 

//////////////////////////////////////////////////////////////////////////////////////////////
function cleanUpLists(approved_vendors,divestment_vendors){
    //get divestment keywords (returns as regexs)
    let dupedKeywords = divestment_vendors.map(row=>row.key_search_words)
    let filteredKeywords = dupedKeywords.filter(key=>{ return !!key && key !== 'Key Search Words' });
    let keywords = [...new Set(filteredKeywords)]; // dedupe
    let keyRegExs = keywords.map(key=> new RegExp(key, "i"));

    // get approved vendor ids
    let approved_ids = [];
    if(approved_vendors){
        approved_ids = approved_vendors.map(row=>row.vendor_id)
    }
    return [keyRegExs, approved_ids]
}

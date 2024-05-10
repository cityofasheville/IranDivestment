import pgpkg from 'pg';
const { Client } = pgpkg;
import Cursor from 'pg-cursor';
import { promisify } from 'util';
import sendEmails from './sendEmails.js';
import getConnection from './getConnection.js';

export async function handler(event) {
  const keyWordFound = [] // vendors in our database containing a keyword in divestment list
  const divestmentVendors = [] // vendors also not marked as approved.

  // approved_ids.forEach(vendor_id=>{ console.log(vendor_id) })
  // keywords.forEach(keyword=>{ console.log(keyword) })

  const db_creds = await getConnection('pubrecdb1/mdastore1/dbadmin');
  if(event.local){
    db_creds.host = 'localhost';
  }
  const client = new Client({
    user: db_creds.username,
    host: db_creds.host,
    port: db_creds.port,
    database: db_creds.database,
    password: db_creds.password
  })
  await client.connect()

  const approved_vendors_data = await client.query('select * from internal.iran_divestment_approved_companies')
  const approved_vendors = approved_vendors_data.rows
  const divestment_vendors_data = await client.query('select * from internal.iran_divestment_restricted_companies')
  const divestment_vendors = divestment_vendors_data.rows

  const [keyRegExs, approved_ids] = cleanUpLists(approved_vendors, divestment_vendors)

  const cursor = client.query(
    new Cursor('select distinct a_vendor_id, a_vendor_name, a_vend_alpha_sort, v_dba from internal.vendors')
  )

  const promisifiedCursorRead = promisify(cursor.read.bind(cursor))

  const ROW_COUNT = 1000
  while (true) {
    const result = await promisifiedCursorRead(ROW_COUNT)

    if (result.length === 0) {
      break
    }

    result.forEach(vendor => {
      keyRegExs.forEach(keyRegEx => {
        if (keyRegEx.test(vendor.a_vendor_name) || keyRegEx.test(vendor.a_vend_alpha_sort) || keyRegEx.test(vendor.v_dba)) {
          vendor.keyword = keyRegEx.toString().substring(1, keyRegEx.toString().length - 2)
          keyWordFound.push(vendor)
        }
      })
    })
  }

  cursor.close(() => {
    client.end()
  })

  // see if found vendors are listed as ok
  keyWordFound.forEach(found1 => {
    if (!approved_ids.some(appr => { // if the vendor we found with bad keywords is not in approved list
      return found1.a_vendor_id == appr
    })) {
      divestmentVendors.push(found1)
    }
  })

  const ret = await sendEmails(divestmentVendors)
  return (ret)
}

/// ///////////////////////////////////////////////////////////////////////////////////////////
function cleanUpLists (approved_vendors, divestment_vendors) {
  // get divestment keywords (returns as regexs)
  const dupedKeywords = divestment_vendors.map(row => row.keywords)
  const filteredKeywords = dupedKeywords.filter(key => { return !!key && key !== 'Key Search Words' })
  const keywords = [...new Set(filteredKeywords)] // dedupe
  const keyRegExs = keywords.map(key => new RegExp(key, 'i'))

  // get approved vendor ids
  let approved_ids = []
  if (approved_vendors) {
    approved_ids = approved_vendors.map(row => row.vendorid)
  }
  return [keyRegExs, approved_ids]
}

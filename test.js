const pug = require('pug');
const path = require('path');

const compiledFunction = pug.compileFile(path.join(__dirname, '/test.pug'));


// let listOfVendors = [
//   {
//         a_vendor_id: "999999",
//         a_vendor_name: "nom",
//         a_vend_alpha_sort: "",
//         v_dba: "",
//         keyword: ""
//   }
// ]
let listOfVendors = {};
listOfVendors.topics = {'type': 'EMAIL', 'email': 'email@addr.com', 'permit_num': '19-02PZ'};
let htmlEmail = compiledFunction(listOfVendors);
console.log(htmlEmail)
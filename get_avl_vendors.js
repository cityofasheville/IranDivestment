const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
let fs = require('fs');

require('dotenv').config();

const dbConfig = {
    authentication: {
        type: "default",
        options: {
            userName: process.env.munisuser, 
            password: process.env.munispassword, 
        }
    },
    server: process.env.munishost,
    options: {
        database: process.env.munisdatabase,  
        encrypt: false
    }
}

function get_avl_vendors(){
    let vendors = [];
    return new Promise(function(resolve, reject) {
        const connection = new Connection(dbConfig);
        connection.on('connect', function(err) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                const request = new Request(
                    // `SELECT [apvn_vend],[apvn_name],[apvn_alpha_sort],[apvn_dba]
                    // FROM [munprod].[dbo].[apvendor];`,
                    `SELECT *
                      FROM [munprod].avl.DeptToDivMapping;`,
                    function(err, rowCount, rows) {
                    if (err) {
                        console.log(err);
                    }
                });
                request.on('row', function(columns) {
                    vendors.push(columns);
                });
                request.on('requestCompleted', function (rowCount, more, rows) { 
                    resolve(vendors);
                    connection.close();
                });
                connection.execSql(request);

            }
        });
    });
}


process.on('uncaughtException', (err)=>{
    console.log(err);
});


module.exports = get_avl_vendors;
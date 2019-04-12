// Pull current Avl vendor list from DB
const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
let fs = require('fs');

require('dotenv').config();

const dbConfig = {
    authentication: {
        type: "default",
        options: {
            userName: process.env.user, 
            password: process.env.password, 
        }
    },
    server: process.env.host,
    options: {
        database: process.env.database,  
        encrypt: false
    }
}

function getAvlVendors(){
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


module.exports = getAvlVendors;
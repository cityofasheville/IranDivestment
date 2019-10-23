const Pool = require('pg-pool');

require('dotenv').config();

async function load_db(approved_vendors,divestment_vendors) {
  let pool = new Pool({
      host: process.env.libhost,
      user: process.env.libuser,
      password: process.env.libpassword,
      database: process.env.libdatabase,
      max: 10,
      idleTimeoutMillis: 10000,
      //  ssl: true,
  });
//   // Load tables
//   await load_real_time_data(real_time_data, 'r_transit.real_time_data', start_date, end_date, dates11and13);
//   await overwrite_data(gtfs.calendar, 'r_transit.gtfs_calendar');
//   await overwrite_data(gtfs.calendar_dates, 'r_transit.gtfs_calendar_dates', date1T);
//   await overwrite_data(gtfs.routes, 'r_transit.gtfs_routes');
//   await overwrite_data(gtfs.stop_times, 'r_transit.gtfs_stop_times', times1and2);
//   await overwrite_data(gtfs.stops, 'r_transit.gtfs_stops');
//   await overwrite_data(gtfs.trips, 'r_transit.gtfs_trips');

//   // Create scheduled_calendar table
//   await run_query("select r_transit.gtfs_create_scheduled_calendar()");

//   // -------------------------------------------------------------
//   async function load_real_time_data(data, table_name, start_date, end_date, repair_function) {
//     let delquery = "DELETE FROM " + table_name + " WHERE scheduled_date BETWEEN '" + start_date + "' AND '" + end_date + "'";
//     await run_query(delquery);
//     if(repair_function) { 
//       append_data(data, table_name, repair_function); 
//     } else {
//       append_data(data, table_name); 
//     }
//   }

//   async function overwrite_data(data, table_name, repair_function) {
//     await run_query("DELETE FROM " + table_name);
//     if(repair_function) { 
//       append_data(data, table_name, repair_function); 
//     } else {
//       append_data(data, table_name); 
//     }
//   }

//   async function append_data(data, table_name, repair_function) {
//     let query_header = "INSERT INTO " + table_name + "(" + data[0].join(',') + ") VALUES ";
//     let chunksOf100 = chunkArray(data.slice(1));
//     chunksOf100.forEach(async (chunk) => {
//       let row_prefix = query_header;
//       let query_string = chunk.reduce((buildStr, row) => {
//         if(repair_function) { 
//           row = repair_function(row); 
//         }
//         row = row.map((item) => {
//           if (item === "") {
//             return 'NULL';
//           } else {
//             return "'" + item.replace("'","''") + "'";
//           }
//         });
//         let curRowStr = "(" + row.join(",") + ")";
//         buildStr = buildStr + row_prefix + curRowStr;
//         row_prefix = ',';
//         return buildStr;
//       },'');
//       await run_query(query_string);
//     });
//     console.log("Table ", table_name);
//   }

//   async function run_query(query_string, params) {
//     try {
//       let results = await pool.query(query_string, params);
//       return results;
//     }
//     catch(err) {
//       console.error(err.message, err.stack); 
//     }
//   }
// }

// function dates11and13(row) {
//   let newRow = row;
//   newRow[11] = fixSwiftlyDate(row[11]);
//   newRow[13] = fixSwiftlyDate(row[13]);
//   return newRow;  
// }
// function times1and2(row) {
//   let newRow = row;
//   newRow[1] = fixTrilliumTime(row[1]);
//   newRow[2] = fixTrilliumTime(row[2]);
//   return newRow;  
// }
// function date1T(row) {
//   let newRow = row;
//   newRow[1] = fixTrilliumDate(row[1]);
//   return newRow;  
// }
// function fixSwiftlyDate(inStr) {
//   // Convert Swiftly dates (MM-DD-YY) to standard YYYY-MM-DD
//   return inStr.replace( /(\d+)\-(\d+)\-(\d+)/, '20$3-$1-$2')
// }
// function fixTrilliumDate(inStr) {
//   // Convert Trillium dates (YYYYMMDD) to standard YYYY-MM-DD
//   return inStr.replace( /(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
// }
// function fixTrilliumTime(inStr) {
//   // Convert Trillium times that start with 24 to start with 00
//   return inStr.slice(0,2)==="24" ? "00" + inStr.slice(2) : inStr;
// }

// function chunkArray(data){
//   //split data so we dont insert more that 1000 rows at a time
//   var results = [];
//   while (data.length) {
//       results.push(data.splice(0, 1000));
//   }
//   return results;
}

module.exports = load_db;



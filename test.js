const { Pool } = require('pg')
const Cursor = require('pg-cursor')

require('dotenv').config();


async function Run(){
    const pool = new Pool({
        user: process.env.user,
        host: process.env.host,
        database: process.env.database,
        password: process.env.password,
        port: 5432,
    })
    // const client = await pool.connect()
    // const text = 'SELECT * FROM internal.vendors'
    // const values = [10]

    // const cursor = client.query(new Cursor(text, values))

    // cursor.read(100, (err, rows) => {
    // console.log(rows);  
    // cursor.close(() => {
    //     client.release()
    // })
    // })


    const client = await pool.connect()
    const cursor = client.query(new Cursor('select * from internal.vendors'))
    cursor.read(100, (err, rows) => {
        if (err) {
            client.end();
            throw err;
        }
        console.log(rows[10].a_vendor_name)
        cursor.read(200, (err, rows) => {
            console.log(rows[10].a_vendor_name);
            client.end();
        })
    })
}

Run();
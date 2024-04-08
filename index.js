const mysql = require('mysql2/promise');
const prompts = require('./prompts.js');

async function doThings() {
    const db =  await mysql.createConnection({
        host:'localhost',
        user: 'root',
        password: 'hamster',
        database: 'employees_db',
    });
    console.log('Database connected');
    prompts.chooseTask(db);
    return db;
}

doThings();





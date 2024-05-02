const { db } = require('./connection');

async function dbConnection() {

    try {
        await db.authenticate();
        console.log('Database online');
    }
    catch (error) { }
}

module.exports = dbConnection;
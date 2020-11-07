const MongoClient = require('mongodb').MongoClient;

module.exports = {
    getCollection,
};

const dbName = 'MR_QUIZ_DB';
const dbURL = 'mongodb+srv://orpt:admin@cluster0.fb6jr.mongodb.net/<dbname>?retryWrites=true&w=majority';
// const dbURL = process.env.MONGODB_URI;
let dbConn = null;

async function getCollection(collectionName) {
    const db = await connect();
    return db.collection(collectionName);
}

async function connect() {
    if (dbConn) return dbConn;
    try {
        const client = await MongoClient.connect(dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const db = client.db(dbName);
        dbConn = db;
        return db;
    } catch (err) {
        console.log('Cannot Connect to DB', err);
        throw err;
    }
}

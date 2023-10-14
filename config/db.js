const mongoose = require('mongoose');
require('dotenv');

const db_url = process.env.db_url;

const db = async () => {
    try{
            const conn = await mongoose.connect(db_url, {
            useNewUrlparser: true,
            useUnifiedTopology: true,
            // useFindAndModify: false,
            // useCreateIndex: true
        });
        console.log(`Mongo connection successfull on : ${conn.connection.host}`);
        
    } catch (e) {
        console.log('ERR: ', e);
    }
    
};

module.exports = db;
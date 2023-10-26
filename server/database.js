const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envFilePath = path.resolve(__dirname, '.env.local');
const envFileContent = fs.readFileSync(envFilePath, 'utf8');
const parsedEnv = dotenv.parse(envFileContent);

const mongoConnectionURI = parsedEnv.MONGODB_URI;

const connectToMongoDB = () => {
    mongoose.connect( mongoConnectionURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

module.exports = connectToMongoDB;
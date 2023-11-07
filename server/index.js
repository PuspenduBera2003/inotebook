const connectToMongoDB = require('./database');
const express = require('express')
const cors = require('cors')
require('dotenv').config({ path: '.env.local' });
const port = 5000;
connectToMongoDB();

const app = express()

app.use(express.json())
app.use(cors())
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))
app.use('/api/friendrequests', require('./routes/friendreq'))
app.use('/api/user', require('./routes/search_user'))

app.listen(port, () => {
    console.log(`iNotebook Backend is running on http://localhost:${port}`);
});
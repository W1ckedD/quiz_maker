const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });

const connectDB = require('./config/db');
connectDB();

const app = express();

app.get('/', (req, res) => {
    return res.json({ app: 'Express' });
});

const { PORT, NODE_ENV } = process.env;
app.listen(PORT, () =>
    console.log(`App running in ${NODE_ENV} mode on port ${PORT}`)
);

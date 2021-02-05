require('./utils/db');
const express = require('express');
const taskRoute = require('./api/task');
const userRoute = require('./api/user');

const app = express();

app.use('/', taskRoute);
app.use('/', userRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

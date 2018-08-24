const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const db = require("./config/keys").mongoURI;
const users = require('./routes/api/users');
const events = require('./routes/api/events');

mongoose
    .connect(db)
    .then(() => console.log('success connection'))
    .catch(err => console.log(err));

app.get('/', (req, res) => res.send('hello cory heyy'));
app.use('/api/users', users);
app.use('/api/events', events);

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port:${port}`));
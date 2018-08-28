const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const db = require("./config/keys").mongoURI;
const users = require('./routes/api/users');
const events = require('./routes/api/events');
const passport = require('passport');
require('./config/passport')(passport);


app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
mongoose
    .connect(db, {useNewUrlParser: true})
    .then(() => console.log('success connection'))
    .catch(err => console.log(err));

// app.get('/', (req, res) => res.send('hello cory hey'));
app.use(passport.initialize());
app.use('/api/users', users);
app.use('/api/events', events);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port:${port}`));
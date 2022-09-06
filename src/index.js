const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080
const appRoute = require('./router')
// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', appRoute)




app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;
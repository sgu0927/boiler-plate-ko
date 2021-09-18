const express = require('express')
const app = express()
const port = 5000

// mongodb+srv://sgu0927:<password>@boilerplate.b4sx7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

const mongoose = require('mongoose')
// mongoose 6부터 useNewUrlParse: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
mongoose.connect('mongodb+srv://sgu0927:abcd1234@boilerplate.b4sx7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
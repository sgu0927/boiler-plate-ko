const express = require('express')
const app = express()
const port = 5000
const { User } = require('./models/User');
const bodyParser = require('body-parser');

const config = require('./config/key');

// application/x-www-form-urlencoded 데이터를 분석해서 가져올 수 있게
app.use(bodyParser.urlencoded({ extended: true }));
// application/json 데이터를 분석해서 가져올 수 있게
app.use(bodyParser.json());

// 비밀정보 깃허브에다 소스 올리면 이부분까지 들어감
// mongodb+srv://sgu0927:<password>@boilerplate.b4sx7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

const mongoose = require('mongoose')
// mongoose 6부터 useNewUrlParse: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
mongoose.connect(config.mongoURI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Hello World 변경되었어요!')
})

app.post('/register', (req, res) => {
    // 회원 가입시 필요한 정보들을 client에서 가져오면 
    // 그것들을 db에 넣어준다.
    const user = new User(req.body);

    // 정보들이 user model에 저장
    user.save((err, userInfo) => {
        // err이면
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
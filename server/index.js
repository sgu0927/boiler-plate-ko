const express = require('express')
const app = express()
const port = 5000
const { User } = require('./models/User');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { auth } = require('./middleware/auth');

const config = require('./config/key');

// application/x-www-form-urlencoded 데이터를 분석해서 가져올 수 있게
app.use(bodyParser.urlencoded({ extended: true }));
// application/json 데이터를 분석해서 가져올 수 있게
app.use(bodyParser.json());
app.use(cookieParser());

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

app.get('/api/hello', (req, res) => {
    res.send("안녕하세요!~");
})

app.post('/api/users/register', (req, res) => {
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
});

app.post('/api/users/login', (req, res) => {
    //요청된 이메일을 데이터베이스에서 있는지 찾는다. findOne-mongodb에서 제공
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        //DB에서 요청한 이메일이 있으면 비밀번호 같은지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });
            //비밀번호까지 같다면 Token을 생성
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                // 토큰을 저장한다. 어디? 쿠키, 로컬스토리지, ... 
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id });
            })
        });
    });
});

// auth - 미들웨어 callback전에 뭔가 해주는 것
app.get('/api/users/auth', auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    });
});

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        })
    });
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
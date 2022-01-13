const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { ConnectionPoolClosedEvent } = require('mongodb');
const userRoute = require('./routes/user');
const postRoute = require('./routes/post');
const catRoute = require('./routes/cats');
const multer = require('multer');
const path = require('path');
// const session = require('express-session');
// const mongoDbSession = require('connect-mongodb-session')(session);
require('dotenv').config();
const app = express();

// const CONNECTION_URL = 'mongodb+srv://abdelrahman:shobra21@cluster0.5s8pp.mongodb.net/blog?retryWrites=true&w=majority';
const CONNECTION_URL = process.env.MONGO_URL;



app.use(cors());

app.use(express.json());
// app.use(express.urlencoded());
app.use("/images", express.static(path.join(__dirname, '/images')));

app.use(function (err, req, res, next) {
    console.log(err);
    return res.status(500).send({ message: 'errorrrr' });
});


const PORT = process.env.PORT || 5000;


mongoose.connect(CONNECTION_URL, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => app.listen(PORT, () =>
    console.log('connection is established and running on port: ' + PORT)
)).catch((err) => console.log(err.message));

// const store = new mongoDbSession({
//     uri: process.env.MONGO_URL,
//     collection: "mySessions",
// });
// app.use(session({
//     secret: "sakrataaa",
//     resave: false,
//     saveUninitialized: false,
//     store: store,
// }));
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    }, filename: (req, file, cb) => {
        cb(null, req.body.name);
    }
});

const upload = multer({ storage: storage });

app.post('/uploadimg', upload.single("file"), (req, res) => {
    return res.status(201).json("file uploaded");
})

app.use('/blog', userRoute);
app.use('/blog', postRoute);
app.use('/blog', catRoute);



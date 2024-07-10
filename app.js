const express = require('express');
const app = express();
const session = require('express-session')
const mysql =  require('mysql2')
const port = 4000;


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'siswa'
});

connection.connect (error => {
    if (error) throw error;
    console.log("sukses masuk ke database")
});

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 6000
    }
}));

const authenticate = (req, res, next) => {
    if (req?.session.isAuthenticated) {
        next();
    } else {
        res.status(401).send('tidak terautentikasi');
    }
};

app.post('/register', (req,res) => {
    const { username,password } = req.body;
    connection.query(`INSERT INTO user VALUES ('${username}',PASSWORD('${password}'))`,
        (error, result) => {
            if (error) throw error;
            res.json({ message: 'data berhasil di tambahkan', id: result.insertId});
    });
});

app.post('/login', (req,res) => {
    const { username, password } = req.body;

    connection.promise().query(`SELECT * FROM user WHERE username = '${username}'
                                AND password = PASSWORD('${password}')`)
    .then((results) => {
        if (results.length > 0) {
            req.session.isAuthenticated =  true ;
            res.json({ message: 'berhasil login '});
        }else
            res.status(401).send('username atau password salah');
    })
    // if (username === 'admin' && password === 'password') {
    //     req.session.isAuthenticated = true;
    //     res.send('login sukses')
    // } else {
    //     res.status(401).send('Kredensial Tidak Valid');
    // }
});

app.get('/logout', (req,res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        } else {
            res.send('logout');
        }
    });
});

// app.get ('/open', (req, res) => {
//     res.send('anda masuk pada route tidak terproteksi')
// });

app.get('/protected', authenticate, (req, res) => {
    res.send('Anda masuk pada route terproteksi (GET)');
});

app.post('/protected', authenticate, (req, res) => {
    res.send('Route terproteksi (POST)');
});

app.put('/protected', authenticate, (req, res) => {
    res.send('Route terproteksi (PUT)');
});

app.delete('/protected', authenticate, (req, res) => {
    res.send('Route terproteksi (DELETE)');
});

app.listen(port, () => {
    console.log(`server berjalan pada localhost:${port}`)
});
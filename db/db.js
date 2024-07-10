const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'siswa'
});
connection.connect (error => {
    if (error) throw error;
    console.log("sukses masuk ke database")
});

module.exports = connection
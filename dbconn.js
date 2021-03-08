const dotenv = require('dotenv');
const mysql = require("mysql");
dotenv.config();

const PORT = process.env.PORT;

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

db.connect((err) => {
	if (err) {
		throw err;
	}
	console.log("MySql Connected...");
});


module.exports = { 
    db,
    PORT
};
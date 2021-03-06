const express = require("express");
const mysql = require("mysql");
const csv = require("csv-parser");
const fs = require("fs");
const dotenv = require('dotenv');

dotenv.config();

const results = [];
const resultDeliveries = [];


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

const app = express();



function matches() {
    let sql = `CREATE TABLE IF NOT EXISTS matches (
        id INT NOT NULL AUTO_INCREMENT,
        season YEAR,
        city VARCHAR(30),
        date DATE,
        team1 VARCHAR(70),
        team2 VARCHAR(70),
        toss_winner VARCHAR(70),
        toss_decision VARCHAR(70),
        result VARCHAR(30),
        dl_applied VARCHAR(70),
        winner VARCHAR(70),
        win_by_runs INT,
        win_by_wickets INT,
        player_of_match VARCHAR(50),
        venue VARCHAR(100),
        umpire1 VARCHAR(30),
        umpire2 VARCHAR(30),
        umpire3 VARCHAR(30),
        PRIMARY KEY (id)
    )`;

    db.query(sql, (err, result, field) => {
        if (err) {
            throw err;
        }
        console.log("created matches table");
    });

}
matches();


function insertInto(table, data) {
    let sql = `INSERT INTO ${table} SET ?`;
    db.query(sql, data, (err, result, field) => {
        if (err) {
            throw err;
        }

        console.log(`data added into table ${table}`);
    });
}


fs.createReadStream("./src/matches.csv")
	.pipe(csv())
	.on("data", (data) => results.push(data))
	.on("end", () => {
		console.log(results);
        results.forEach((match) => {
            insertInto('matches', match);
        });

	});
//app.get("/get", (req, res) => {
// 	let sql = "SELECT * FROM matches";
// 	let query = db.query(sql, (err, results) => {
// 		if (err) {
// 			throw err;
// 		}
// 		console.log(results);
// 		res.send("Fetched..");
// 	});
// });

app.listen("3000", () => console.log("Server started on port 3000"));

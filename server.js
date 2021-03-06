const express = require("express");
const mysql = require("mysql");
const csv = require("csv-parser");
const fs = require("fs");
const dotenv = require('dotenv');

const app = express();
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

function deliveries() {
    let sql = `CREATE TABLE IF NOT EXISTS deliveries (
        id INT NOT NULL AUTO_INCREMENT,
        match_id INT,
        inning INT,
        batting_team VARCHAR(90),
        bowling_team VARCHAR(90),
        overs INT(9),
        ball INT(9),
        batsman VARCHAR(90),
        non_striker VARCHAR(90),
        bowler VARCHAR(90),
        is_super_over INT,
        wide_runs INT,
        bye_runs INT,
        legbye_runs INT,
        noball_runs INT,
        penalty_runs INT,
        batsman_runs INT,
        extra_runs INT,
        total_runs INT,
        player_dismissed VARCHAR(90),
        dismissal_kind VARCHAR(90),
        fielder VARCHAR(90),
        FOREIGN KEY (match_id) REFERENCES matches(id),
        PRIMARY KEY (id)
    );`;

    db.query(sql, (err, result, field) => {
        if (err) {
            throw err;
        }
        console.log('deliveries table is created');
    });
}
deliveries();

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
        results.forEach((match) => {
            insertInto('matches', match);
        });
	});

fs.createReadStream("./src/deliveries.csv")
	.pipe(csv())
	.on("data", (data) => resultDeliveries.push(data))
	.on("end", () => {
        console.log(resultDeliveries);
        
        resultDeliveries.forEach((deli) => {
            insertInto('deliveries', deli);
        });
	});


app.listen("3000", () => console.log("Server started on port 3000"));

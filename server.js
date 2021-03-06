const express = require("express");
const mysql = require("mysql");
const csv = require("csv-parser");
const fs = require("fs");
const dotenv = require('dotenv');
const { stringify } = require("querystring");

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


db.query('DROP TABLE IF EXISTS deliveries',(err, result, field) => {
    if (err) {
        throw err;
    }
    console.log("DELETED TABLES");
}
);

db.query('DROP TABLE IF EXISTS matches',(err, result, field) => {
    if (err) {
        throw err;
    }
    console.log("DELETED TABLES");
}
);

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
    let sql = `
        CREATE TABLE IF NOT EXISTS deliveries (
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

function insertInto(table, data , column = '' ) {
    let sql = `INSERT INTO ${table}  ${column} VALUES ?`;
    db.query(sql, [data], (err, result, field) => {
        if (err) {
            console.log(err);
            
        }else{

        console.log(`data added into table ${table}`);
        }
    });
}

function objValue(data){
    let val = data.map(ele => Object.values(ele));
    return val;
}

fs.createReadStream("./src/matches.csv")
	.pipe(csv())
	.on("data", (data) => results.push(data))
	.on("end", () => {
        let match = objValue(results);
        insertInto('matches', match);
        
	});

fs.createReadStream("./src/deliveries.csv")
	.pipe(csv())
	.on("data", (data) => resultDeliveries.push(data))
	.on("end", () => {        
        let deli = objValue(resultDeliveries);
        insertInto('deliveries', deli , '(match_id,inning,batting_team,bowling_team,overs,ball,batsman,non_striker,bowler,is_super_over,wide_runs,bye_runs,legbye_runs,noball_runs,penalty_runs,batsman_runs,extra_runs,total_runs,player_dismissed,dismissal_kind,fielder)');
	});


app.listen("3000", () => console.log("Server started on port 3000"));

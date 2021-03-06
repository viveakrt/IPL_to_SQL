const { db,PORT }  = require('./dbconn.js');

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


function insertInto(table, data , column = '' ) {
    let sql = `INSERT INTO ${table}  ${column} VALUES ?`;
    db.query(sql, [data], (err, result, field) => {
        if (err) {
            console.log(err);
            
        }else{

        console.log(`data added into table ${table} DONE`);
        }
    });
}

module.exports={
    matches,
    deliveries,
    insertInto,
    PORT
};
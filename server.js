const express = require("express");
const { insertInto, matches , deliveries, PORT }  = require('./createdb.js');
const csv = require("csv-parser");
const fs = require("fs");

const app = express();


const results = [];
const resultDeliveries = [];

matches();
deliveries();


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
        try{
        let deli = objValue(resultDeliveries);
        insertInto('deliveries', deli , '(match_id,inning,batting_team,bowling_team,overs,ball,batsman,non_striker,bowler,is_super_over,wide_runs,bye_runs,legbye_runs,noball_runs,penalty_runs,batsman_runs,extra_runs,total_runs,player_dismissed,dismissal_kind,fielder)');
        }
        catch(err){
            throw err;
        }
        
    });
    

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

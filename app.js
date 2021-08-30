const express = require('express');
const mysql = require('mysql');

const mysqlConfig = {
    host: "mysql",
    user: "tester",
    password: "password",
    database: "MCC"
}

const app = express()

let con= null;

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/', function(req, res) {
    res.send('Health Plan Api');
});

app.get('/connect', function(req, res) {
    con = mysql.createConnection(mysqlConfig);
    con.connect(function(err){
        if(err) throw err;
        res.send('connected');
    })
})

app.get('/create-table', function(req, res){
    con = mysql.createConnection(mysqlConfig);
    con.connect(function(err){
        if(err) throw err;
        const sqlHealthPlans = 'CREATE TABLE IF NOT EXISTS health_plans (plan_id INT PRIMARY KEY, title VARCHAR(255) NOT NULL, value_per_month INT)';
        const sqlHealthPlanItem = 'CREATE TABLE IF NOT EXISTS health_plan_item (item_id INT PRIMARY KEY, item_name VARCHAR(255))';
        const sqlHealthPlansItems = 'CREATE TABLE IF NOT EXISTS health_plans_items(plan_id INT, item_id INT, is_checked Bit, item_enabled Bit, PRIMARY KEY(plan_id, item_id), FOREIGN KEY(plan_id) REFERENCES health_plans(plan_id), FOREIGN KEY(item_id) REFERENCES health_plan_item(item_id))';
        
        con.query(sqlHealthPlans, function (err, result){
            if (err) throw err;
        });

        con.query(sqlHealthPlanItem, function (err, result) {
            if (err) throw err;
        });

        con.query(sqlHealthPlansItems, function (err, result) {
            if (err) throw err;
        });

        res.send("All table created");
    })
})

app.get('/insert-table', function (req, res) {
    con = mysql.createConnection(mysqlConfig);
    con.connect(function (err) {
        if (err) throw err;

        let insertSql = [
                'INSERT IGNORE INTO health_plans VALUE (1, \'Standard Plan\', \'0\');',
                'INSERT IGNORE INTO health_plans VALUE ( 2, \'Advanced Plan\', \'188\');',
                'INSERT IGNORE INTO health_plans VALUE ( 3, \'Premium Plan\', \'388\');',
                'INSERT IGNORE INTO health_plan_item VALUE ( 1, \'General\');',
                'INSERT IGNORE INTO health_plan_item VALUE ( 2, \'Specialist\');',
                'INSERT IGNORE INTO health_plan_item VALUE ( 3, \'Physiotherapy\');',
                'INSERT IGNORE INTO health_plans_items VALUE ( 1, 1, b\'1\', b\'1\');',
                'INSERT IGNORE INTO health_plans_items VALUE ( 1, 2, b\'0\', b\'1\');',
                'INSERT IGNORE INTO health_plans_items VALUE ( 1, 3, b\'0\', b\'1\');',
                'INSERT IGNORE INTO health_plans_items VALUE ( 2, 1, b\'1\', b\'1\');',
                'INSERT IGNORE INTO health_plans_items VALUE ( 2, 2, b\'1\', b\'1\');',
                'INSERT IGNORE INTO health_plans_items VALUE ( 2, 3, b\'0\', b\'1\');',
                'INSERT IGNORE INTO health_plans_items VALUE ( 3, 1, b\'1\', b\'1\');',
                'INSERT IGNORE INTO health_plans_items VALUE ( 3, 2, b\'1\', b\'1\');',
                'INSERT IGNORE INTO health_plans_items VALUE ( 3, 3, b\'1\', b\'1\');'
        ]
        
        for (let i = 0; i < insertSql.length; i++) {
            const sql = insertSql[i];

            con.query(sql, function (err, result) {
                if (err) throw err;
            });
        }

        res.send("health plan table data inserted");
    });
});

app.get('/getHealthPlans', function(req,res){
    con = mysql.createConnection(mysqlConfig);
    con.connect(function(err){
        if(err) throw err;
        const sql = 'SELECT * FROM health_plans';
        con.query(sql, function (err, result, fields){
            if(err) throw err;
            res.send(JSON.stringify(result))
        });
    });
})

app.get('/getHealthPlanItem', function (req, res) {
    con = mysql.createConnection(mysqlConfig);
    con.connect(function (err) {
        if (err) throw err;
        const sql = 'SELECT * FROM health_plan_item';
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.send(JSON.stringify(result))
        });
    });
})

app.get('/getHealthPlansItems', function (req, res) {
    con = mysql.createConnection(mysqlConfig);
    con.connect(function (err) {
        if (err) throw err;
        const sql = 'SELECT * FROM health_plans_items';
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.send(JSON.stringify(result))
        });
    });
})

app.listen(3001)
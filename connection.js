var mysql=require('mysql');
var util=require('util')

var con=mysql.createConnection({
    host:'localhost',
    password:"",
    user:"root",
    database:'project'
});

var execute=util.promisify(con.query).bind(con)
module.exports=execute;
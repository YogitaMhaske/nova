var express=require('express');
var app=express();
var bodyparser=require('body-parser');
var upload=require('express-fileupload');
var url=require('url')
var session=require('express-session')

app.use(bodyparser.urlencoded({extended:'true'}));
app.use(upload());
app.use(session({
    secret:'Yogita',
    resave:true,
    saveUninitialized:true
}))
app.use(express.static('public/'))


var adminRoute=require('./routes/admin',adminRoute);
app.use("/admin",adminRoute);

var userRoute=require('./routes/user',userRoute);
app.use("/",userRoute);


// app.get("/",function(req,res){
//     res.send("data")
// })
app.listen(1000);
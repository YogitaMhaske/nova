var express=require('express');
var router=express.Router()
var execute=require('./../connection');
var url=require('url');
const { exec } = require('child_process');
 
router.get("/",async function(req,res){
    var home_image=await execute(`select * from home_image`)
    var wcu=await execute(`select * from why_choose_us_image`)
    var wcu_slider=await execute(`select * from why_choose_us_slider`)
    var icon=await execute(`select * from icon_service`)
    var blog=await execute(`select * from blog`)
    var call=await execute(`select * from call_to_action`)
    var features=await execute(`select * from features`)
    var  features_det=await execute(`select * from  features_det`)
    var  logo=await execute(`select * from  company_info`)
    var links=await execute(`select * from links`)
    
    res.render('user/home.ejs',{home_image:home_image,
                                wcu_image:wcu,
                                wcu_slider:wcu_slider,
                                icon_service:icon,
                                blog_det:blog,
                                call_to_action:call,
                                features:features,
                                features_det: features_det,
                                logo:logo,
                                links:links
                              })
})


router.get("/about",async function(req,res){
    var  logo=await execute(`select * from  company_info`)
    var about=await execute('select * from about_image')
    var about_sub=await execute('select * from about_sub_image')
    var key=await execute('select * from key_points')
    var wcu=await execute(`select * from why_choose_us_image`)
    var wcu_slider=await execute(`select * from why_choose_us_slider`)
    var  team=await execute('select * from team')
    var call=await execute(`select * from call_to_action`)
    var links=await execute(`select * from links`)
    res.render("user/about.ejs" ,{about_img:about,
                                  about_sub_img:about_sub,
                                  key:key,
                                  wcu_image:wcu,
                                  wcu_slider:wcu_slider,
                                  team:team , logo:logo ,
                                  call_to_action:call,
                                  links:links
                                })
})

router.get("/services",async function(req,res){
    var  logo=await execute(`select * from  company_info`)
    var service=await execute('select * from service_image')
    var icon=await execute(`select * from icon_service`)
    var image_service=await execute(`select * from image_service`)
    var testi=await execute(`select * from testimonial`)
    var links=await execute(`select * from links`)
    res.render("user/services.ejs" , {service:service, 
                                            icon_service:icon,
                                            img_service:image_service,
                                           testimonial:testi,logo:logo,links:links})
})

router.get("/team",async function(req,res){
    var  logo=await execute(`select * from  company_info`)
    var  team=await execute('select * from team')
    var team_img=await execute('select * from team_image')
    var links=await execute(`select * from links`)
    res.render("user/team.ejs",{team:team , team_img:team_img,logo:logo,links:links})
})

router.get("/portfolio",async function(req,res){
    var  logo=await execute(`select * from  company_info`)
    var port=await execute('select * from portfolio_image')
    var port_type=await execute('select * from portfolio_type')
    var portfolio=await execute('select * from portfolio')
    var links=await execute(`select * from links`)
    res.render("user/portfolio.ejs",{port_image:port,
                                  port_type:port_type,
                                   portfolio:portfolio,
                                   logo:logo,
                                   links:links
                                });
})

router.get("/portfolio_det",async function(req,res){
    var  logo=await execute(`select * from  company_info`)
    var port_det=await execute('select * from portfolio')
    var port_det_img=await execute('select * from port_det_image')
    var links=await execute(`select * from links`)
    var urlData=url.parse(req.url,true).query;
    var portfolio_det=await execute("SELECT * FROM portfolio WHERE portfolio_id='"+urlData.id+"'");
    console.log(portfolio_det)
    res.render("user/portfolio_det.ejs",{port_det:port_det ,
                                      port_det_img:port_det_img,
                                      logo:logo,
                                      links:links,
                                      portfolio:portfolio_det})
})

router.get("/blog",async function(req,res){
    var  logo=await execute(`select * from  company_info`)
    var blog=await execute('select * from blog_image')
    var blog_data=await execute('select * from blog')
    var blog_cat=await execute('select * from blog_category')
    var links=await execute(`select * from links`)
    res.render("user/blog.ejs",{blog_img:blog,blog_cat:blog_cat,blogcat:blog_data,logo:logo,links:links})
})

router.get("/blog_det",async function(req,res){
    var  backimg=await execute(`select * from  blog_det_image`)
    var  logo=await execute(`select * from  company_info`)
    var links=await execute(`select * from links`)
    var urlData=url.parse(req.url,true).query;
    var blog_det=await execute("SELECT * FROM blog WHERE blog_id='"+urlData.blog_id+"'");
    res.render("user/blog_det.ejs",{back_img:backimg,blog_det:blog_det,logo:logo,links:links})
})

router.get("/contact",async function(req,res){
    var  logo=await execute(`select * from  company_info`)
    var  contact=await execute(`select * from  contact_image`)
    var links=await execute(`select * from links`)
    res.render("user/contact.ejs",{logo:logo,contact:contact,links:links})
})

router.post("/messages",async function (req,res){
    var sql=`insert into messages (name  ,email  ,subject  ,message ) values ('${req.body.name}','${req.body.email}','${req.body.subject}','${req.body.message}')`;
    var data=await execute(sql);
    res.send(`<script>
            alert('Your message has been sent. Thank you...!!!!')
            window.location.assign('/');
            </script>`);
})
module.exports=router;

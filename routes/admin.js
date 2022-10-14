var express=require('express');
var router=express.Router()
var execute=require('./../connection');
var url=require('url');

router.get("/",function(req,res){
    if(req.session.admin_id)
    res.render("admin/home.ejs")
    else
    {
     res.send(`<script>
                 alert('Login Failed')
                 window.location.assign('/admin/login');
            </script>`);
    }
})


router.get("/login",function(req,res){
    res.render("admin/login.ejs");
})


router.post("/login_process",async function(req,res){
   console.log(req.body);
   var sql=`select * from admin where admin_email='${req.body.admin_email}' AND admin_password='${req.body.admin_password}'` 
   var data=await execute(sql) 
   console.log(data);
   if(data.length>0)
   {
    req.session.admin_id=data[0].admin_id;
    res.send(`<script>
              alert('Login Success')
              window.location.assign('/admin')
          </script>`);
   }
   else
   {
    res.send(`<script>
                alert('Login Failed')
                window.location.assign('/admin/login');
           </script>`);
   }
//    res.send("hello")
})


router.get("/basic_info",async function(req,res){
    req.session.admin_id=1;
    if(req.session.admin_id)
    {
        var data=await execute(`select * from company_info`)
        // console.log(data)
        var obj={'company_info':data[0]}
    res.render("admin/basic_info.ejs",obj)
    }
    else
    {
     res.send(`<script>
                 alert('Login Failed')
                 window.location.assign('/admin/login');
            </script>`);
    }
    res.render("admin/basic_info.ejs")
})


router.post("/save_basic_info", async function(req,res){
    console.log(req.files)
    var image_name="";
    if(req.files)
    {
    image_name=req.files.company_logo.name;
    req.files.company_logo.mv('public/uploads/' + image_name);
    var d=req.body;
    var sql=`UPDATE company_info SET 
                  company_logo = '${image_name}',
                  company_name='${d.company_name}',
                  company_slogan='${d.company_slogan}',
                  company_address='${d.company_address}',
                  company_mobile='${d.company_mobile}',
                  company_email='${d.company_email}',
                  company_twitter_link:='${d.company_twitter_link}',
                  company_facebook_link='${d.company_facebook_link}',
                  company_instagram_link='${d.company_instagram_link}',
                  company_linkedin_link='${d.company_linkedin_link}'
                  where
                  company_info_id=1 `;
   }
   else
   {
          var d=req.body;
           var sql=`UPDATE company_info SET 
                  company_name='${d.company_name}',
                  company_slogan='${d.company_slogan}',
                  company_address='${d.company_address}',
                  company_mobile='${d.company_mobile}',
                  company_email='${d.company_email}',
                  company_twitter_link:='${d.company_twitter_link}',
                  company_facebook_link='${d.company_facebook_link}',
                  company_instagram_link='${d.company_instagram_link}',
                  company_linkedin_link='${d.company_linkedin_link}'
                  where
                  company_info_id=1 `;
   }
   var data=await execute(sql);
    // console.log(req.body)
    res.redirect("/admin/basic_info")


})

router.get("/links",async function (req,res){
    var data=await execute(`select * from links `)
    res.render('admin/contact_us.ejs',{link_det:data})
})
router.post("/save_useful_ourservices_link",async function(req,res){
    console.log(req.body);
    var d=req.body;
    var data= await execute(`insert into links ( useful_link  ,ourservices_link ) values ('${d.useful_link}','${d.ourservices_link}')`)
    res.redirect('/admin/links')
})

router.get("/delete_link",async function(req,res){
    var urlData=url.parse(req.url,true).query;
    var data=await execute("delete from links where link_id='"+urlData.id+"'");
    res.redirect('/admin/links')
})
// home page image
router.get("/heading_images" , async function(req,res){
    var homedata=await execute("select * from home_image");
    var aboutdata=await execute("select * from about_image");
    var servicedata=await execute("select * from service_image");
    var portfoliodata=await execute("select * from portfolio_image");
    var portdetdata=await execute("select * from port_det_image");
    var teamdata=await execute("select * from team_image");
    var blogdata=await execute("select * from blog_image");
    var blogdetdata=await execute("select * from blog_det_image");
    var contactdata=await execute("select * from contact_image");
    var obj={'homedata':homedata,'aboutdata':aboutdata,'servicedata':servicedata ,'portfoliodata':portfoliodata ,'portdetdata':portdetdata, 
    'teamdata':teamdata , 'blogdata':blogdata ,'blogdetdata':blogdetdata,'contactdata':contactdata}
    res.render('admin/heading_images.ejs',obj)
});

router.post("/save_home_img",async function(req,res){
    var image_name="";
    if(req.files)
    {
    image_name=req.files.home_image.name;
    req.files.home_image.mv('public/uploads/'+image_name)   
    // console.log(req.body)
    var d=req.body;
    // var sql=`create table home_image(home_image_id INT PRIMARY KEY AUTO_INCREMENT ,home_title , home_info text ,get_started_link text ,video_link text,home_image text )`
    // var sql=`INSERT INTO  home_image(home_title , home_info ,get_started_link ,video_link ,home_img)   values ('${d.home_title}','${d.home_info}','${d.get_started_link}','${d.video_link}','${image_name}')`;
    var sql=`update  home_image set
                home_title='${d.home_title}',
                home_info='${d.home_info}',
                get_started_link='${d.get_started_link}',
                video_link='${d.video_link}',
                home_image='${image_name}'
                where home_image_id=1; `;
    var data=await execute(sql)
    res.redirect('/admin/heading_images')
    }
    else
    {
        var d=req.body;
        var sql=`update  home_image set
                    home_title='${d.home_title}',
                    home_info='${d.home_info}',
                    get_started_link='${d.get_started_link}',
                    video_link='${d.video_link}'
                    where home_image_id=1; `;
        var data=await execute(sql)
        res.redirect('/admin/heading_images')
    }
})

// about page image
router.post("/save_about_img" , async function(req,res){
    var image_name="";
    if(req.files)
    {
        image_name=req.files.about_image.name;
        req.files.about_image.mv('public/uploads/'+image_name)
    }
    // var sql=`insert into about_image (about_image) values ('${image_name}')`;
    var sql=`update about_image set 
        about_image='${image_name}'
        where about_image_id=1;`
    var data=await execute(sql)
    res.redirect('/admin/heading_images')
})


// service page
router.post("/save_service_img" , async function(req,res){
    var image_name="";
    if(req.files)
    {
        image_name=req.files.service_image.name;
        req.files.service_image.mv('public/uploads/'+image_name)
    }
    // var sql=`insert into service_image (service_image) values ('${image_name}')`
    var sql=`update service_image set  
                service_image='${image_name}'
                where service_image_id=1;`
    var data=await execute(sql);
    res.redirect('/admin/heading_images')
})


// portfolio page
router.post("/save_portfolio_img" , async function(req,res){
    var image_name="";
    if(req.files)
    {
        image_name=req.files.portfolio_image.name;
        req.files.portfolio_image.mv('public/uploads/'+image_name)
    }
//    var sql=`insert into portfolio_image (portfolio_image) values ('${image_name}')`
    var sql=`update portfolio_image set 
                 portfolio_image='${image_name}'
                 where portfolio_image_id=1;`
    var data=await execute(sql)
    res.redirect('/admin/heading_images')
})

router.post("/save_portfoliodet_img",async function(req,res){
    var image_name="";
    if(req.files){
     image_name=req.files.portfolio_det_image.name;
    req.files.portfolio_det_image.mv('public/uploads/'+image_name)
    }
    // var data=await execute(`insert into port_det_image (portfolio_det_image) values ('${image_name}')`);
    var sql=`update port_det_image set 
               portfolio_det_image='${image_name}'
                where port_det_id=1;`
     var data=await execute(sql)
     res.redirect('/admin/heading_images')
})

//team_img
router.post("/save_team_img" , async function(req,res){
    var image_name="";
    if(req.files)
    {
        image_name=req.files.team_image.name;
        req.files.team_image.mv('public/uploads/' + image_name)
    }
    // var sql=`insert into team_image (team_image) values ('${image_name}')`
    var sql=`update team_image set
                team_image='${image_name}'
                where team_image_id=1;`
    var data=await execute (sql)
    res.redirect('/admin/heading_images')
})

// blog image
router.post("/save_blog_img" ,async function(req,res){
    var image_name="";
    if(req.files)
    {
        image_name=req.files.blog_image.name;
        req.files.blog_image.mv('public/uploads'+image_name)
    }
    // var sql=`create table blog_image (blog_image_id INT AUTO_INCREMENT PRIMARY KEY , blog_image text)`
    // var sql=`insert into blog_image (blog_image) values ('${image_name}')`
    var sql=`update  blog_image set 
             blog_image='${image_name}' 
             where blog_image_id=1`
    var data=await execute(sql)
    res.redirect('/admin/heading_images')
})

router.post("/save_blogdet_img",async function(req,res){
    var image_name="";
    if(req.files)
    {
        image_name=req.files.blogdet_image.name;
        req.files.blogdet_image.mv('public/uploads/'+image_name)
    }
    // var data=await execute('create table blog_det_image (blog_det_id INT AUTO_INCREMENT PRIMARY KEY , blogdet_image text)')
    // var data=await execute(`insert into blog_det_image (blogdet_image) values ('${image_name}')`)
    var data=await execute(`update blog_det_image set blogdet_image='${image_name}' where blog_det_id=1;`)
    res.redirect('/admin/heading_images')
})
// contact page
router.post("/save_contact_img" ,async function(req,res){
    var image_name="";
    if(req.files)
    {
        image_name=req.files.contact_image.name;
        req.files.contact_image.mv('public/uploads/'+image_name)
    }
    // var sql=`insert into contact_image (contact_image) values ('${image_name}')`
    var sql=`update contact_image set 
                  contact_image='${image_name}'
                  where contact_image_id=1;`
    var data=await execute(sql)
    res.redirect('/admin/heading_images')
})


// why choose us  image
router.get("/why_choose_us" , async function(req,res){
    var wcuimg=await execute('select * from why_choose_us_image')
    var wcuslider=await execute('select * from why_choose_us_slider')
    var data={'wcu_image':wcuimg , 'wcu_slider':wcuslider}
    res.render("admin/why_choose_us.ejs",data)
})

router.post("/save_why_choose_us" , async function(req,res){
    var image_name="";
    if(req.files)
    {
        image_name=req.files.wcu_image.name;
        req.files.wcu_image.mv('public/uploads/'+image_name)
    }
    // var sql=`insert into why_choose_us_image (wcu_image) values ('${image_name}')`
    var sql=`update why_choose_us_image  set
                        wcu_image='${image_name}'
                        where wcu_image_id=1;`
    var data=await execute(sql)
    res.redirect('/admin/why_choose_us')
})


// wcu_slider
router.post("/save_wcu_slider" ,async function(req,res){
    console.log(req.body)
    var d=req.body;
     var sql=`insert into  why_choose_us_slider (wcu_title,wcu_sub_title,wcu_desc) values 
     ('${d.wcu_title}','${d.wcu_sub_title}','${d.wcu_desc}')`
    var data=await execute(sql)
    res.redirect('/admin/why_choose_us')
})

router.get("/delete_info" , async function(req,res){
    var urlData=url.parse(req.url,true).query;
    var sql="delete from why_choose_us_slider where wcu_slider_id='"+urlData.id+"'";
    var data=await execute(sql)
    res.redirect('/admin/why_choose_us')
})


router.get("/edit_info" ,async function(req,res){
    var urlData=url.parse(req.url,true).query;
    var sql="select * from why_choose_us_slider where wcu_slider_id='"+urlData.id+"'";
    var wcuslider=await execute(sql)    
    // console.log(wcuslider)
    res.render("admin/editslider.ejs",{'edit_wcu_slider':wcuslider})
})


router.post("/save_slider_update",async function(req,res){
    var d=req.body;
    var sql=`update why_choose_us_slider set 
                 wcu_title='${d.wcu_title}',
                 wcu_sub_title='${d.wcu_sub_title}',
                 wcu_desc='${d.wcu_desc}'
                 where 
                 wcu_slider_id='${d.wcu_slider_id}'`;
    var data=await execute(sql)
    // console.log(sql)
    res.redirect("/admin/why_choose_us")
})


// about us
router.get("/about_us" ,async function(req,res){
    var data=await execute(`select * from about_sub_image`)
    var key=await execute(`select * from key_points`)
    var obj={'abt_img':data ,'key':key }
    res.render("admin/about_us.ejs",obj)
})

router.post("/about_subimage",async function(req,res){
    var image_name="";
    if(req.files)
    {
        image_name=req.files.about_image.name;
        req.files.about_image.mv('public/uploads/'+image_name)   
    var d=req.body;
    // var sql=`create table about_sub_image (about_image_id INT PRIMARY KEY AUTO_INCREMENT , about_title text , about_desc text , about_image text)`
    // var sql=`insert into about_sub_image (about_title , about_desc , about_image) values ( '${d.about_title}','${d.about_desc}','${image_name}') `
    var sql=`update about_sub_image set 
             about_title ='${d.about_title}',
             about_desc ='${d.about_desc}',
             about_image ='${image_name}'
             where about_image_id =1`
    var data=await execute(sql)
    res.redirect('/admin/about_us')
    }
    else
    { 
        var d=req.body;
        var sql=`update about_sub_image set 
        about_title ='${d.about_title}',
        about_desc ='${d.about_desc}'
        where about_image_id =1`
var data=await execute(sql)
res.redirect('/admin/about_us')
    }
})


router.post("/save_key_points",async function(req,res){
    // var sql=`create table key_points (key_points_id INT AUTO_INCREMENT PRIMARY KEY , key_point text)`
     var sql=`insert into  key_points ( key_point) values ('${req.body.key_point}')`
       var data=await execute(sql)
    res.redirect('/admin/about_us')
})

router.get("/delete_key",async function(req,res){
    var urlData=url.parse(req.url,true).query;
    var data=await execute("delete from key_points where key_points_id='"+urlData.id+"' ")
    res.redirect('/admin/about_us')
})

router.get("/edit_key", async function(req,res){
    var urlData=url.parse(req.url,true).query;
     var data=await execute('select * from  key_points')
     res.render('admin/edit_key.ejs',{keys:data})
})

router.post("/save_key",async function(req,res){
    var sql=`update  key_points  set 
                key_point ='${req.body.key_point}'
                where key_points_id='${req.body.key_points_id}'`
    var data=await execute(sql)
    res.redirect('/admin/about_us')
})


// call to action 
router.get("/call_to_action",async function(req,res){
    var data=await execute('select * from call_to_action')
    res.render("admin/call_to_action.ejs",{call:data})
})

router.post("/call_to_action",async function(req,res){
    var image_name="";
    if(req.files)
    {
        image_name=req.files.call_image.name;
        req.files.call_image.mv('public/uploads/'+image_name)
    // var data=await execute(`insert into call_to_action (call_image  ,call_title ,call_desc) values ('${image_name}','${req.body.call_title}','${req.body.call_desc}')` )
   var sql= `update call_to_action set 
                 call_image='${image_name}',
                 call_title='${req.body.call_title}',
                 call_desc='${req.body.call_desc}'
                 where call_id=1;`
    }
    else
    {
        var sql= `update call_to_action set 
                 call_title='${req.body.call_title}',
                 call_desc='${req.body.call_desc}'
                 where call_id=1;`
    }
    var data=await execute(sql)
    res.redirect("/admin/call_to_action")
})



// features
router.get("/our_features",async function(req,res){
    var data=await execute('select * from features_det')
    var features=await execute('select * from features')
    res.render("admin/our_features.ejs",{fea_det:data,features:features})
})


router.post("/our_features_det",async function(req,res){
    var image_name="";
    if(req.files)
    {
        image_name=req.files.features_image.name;
        req.files.features_image.mv('public/uploads/'+image_name)
    var sql=`update features_det set 
                 features_image='${image_name}' ,
                 features_title ='${req.body.features_title}',
                 features_desc='${req.body.features_desc}' 
                 where features_id=1;`
    }
    else
    {
     var sql=`update features_det set 
        features_title ='${req.body.features_title}',
        features_desc='${req.body.features_desc}' 
        where features_id=1;` 
    }
    var data=await execute(sql);
    res.redirect("/admin/our_features")
})

router.post("/save_features",async function(req,res){
    var data=await execute(`insert into features (feature_icon,feature ) values ('${req.body.feature_icon}','${req.body.feature}')`)
    res.redirect("/admin/our_features")
})


router.get("/delete_feature",async function(req,res){
    var urlData=url.parse(req.url,true).query;
    var data=await execute("delete from features where feature_id='"+urlData.id+"'")
    res.redirect("/admin/our_features")
})

router.get("/edit_feature",async function(req,res){
    var urlData=url.parse(req.url,true).query;
    var data=await execute("select * from features where feature_id='"+urlData.id+"'")  
     res.render("admin/edit_feature.ejs",{'edit_feat':data})
})

router.post("/save_feature",async function(req,res){
    var sql=`update features set  
                 feature_icon='${req.body.feature_icon}',
                 feature='${req.body.feature}'
                 where 
                 feature_id ='${req.body.feature_id}'`
    var data=await execute(sql)
    res.redirect("/admin/our_features")
})


// team
router.get("/our_team",async function(req,res){
    var data=await execute('select * from team')
    res.render("admin/our_team.ejs",{teamdata:data})
})


router.post("/save_team",async function(req,res){
    var image_name="";
    if(req.files)
    {
        image_name=req.files.team_image.name;
        req.files.team_image.mv('public/uploads/'+image_name)
    }
    var d=req.body;
    var sql=`insert into team (team_image ,team_name ,team_position ,team_twitter_link ,team_insta_link ,team_linkedin_link ,team_fb_link)
    values ('${image_name}','${d.team_name}','${d.team_position}','${d.team_twitter_link}','${d.team_insta_link}','${d.team_linkedin_link}','${d.team_fb_link}')`
    var data=await execute(sql)
    res.redirect('/admin/our_team')
})

router.get("/delete_team",async function(req,res){
    var urlData=url.parse(req.url,true).query;
    var data=await execute("delete from team where team_id='"+urlData.id+"'")
    res.redirect('/admin/our_team')
})

router.get("/edit_team",async function(req,res){
    var urlData=url.parse(req.url,true).query;
    var teamdata=await execute("select * from team where team_id='"+urlData.id+"'");
    res.render('admin/edit_team.ejs',{team_data:teamdata})
})

router.post("/update_team",async function(req,res){
    var image_name="";
    if(req.files)
    {
        image_name=req.files.team_image.name;
        req.files.team_image.mv('public/uploads/'+image_name)
    
    var d=req.body;
    var sql=`update team set 
               team_name='${d.team_name}',
               team_position='${d.team_position}',
               team_twitter_link='${d.team_twitter_link}',
               team_insta_link='${d.team_insta_link}',
               team_linkedin_link='${d.team_linkedin_link}',
               team_fb_link='${d.team_fb_link}',
               team_image='${image_name}'
               where team_id='${d.team_id}'`
    }
    else
    {
        var d=req.body;
        var sql=`update team set 
                   team_name='${d.team_name}',
                   team_position='${d.team_position}',
                   team_twitter_link='${d.team_twitter_link}',
                   team_insta_link='${d.team_insta_link}',
                   team_linkedin_link='${d.team_linkedin_link}',
                   team_fb_link='${d.team_fb_link}'
                   where team_id='${d.team_id}'`
    }
    var data=await execute(sql)
    console.log(sql)
    res.redirect('/admin/our_team')
})


// service
 router.get("/icon_services",async function(req,res){
    var icon_data=await execute(`select * from icon_service`)
    res.render('admin/icon_services.ejs',{icon:icon_data})
 })

router.post("/save_icon_service",async function(req,res){
    var sql=`insert into icon_service (service_icon ,service_title ,service_desc) values 
    ('${req.body.service_icon}','${req.body.service_title}','${req.body.service_desc}')`
    var data=await execute(sql)
    res.redirect('/admin/icon_services')
})

router.get("/delete_iconservice",async function(req,res){
    var urlData=url.parse(req.url,true).query;
    var sql="delete from icon_service where icon_service_id='"+urlData.id+"'";
    var data=await execute(sql)
    res.redirect('/admin/icon_services')
    console.log(sql)
})


router.get("/edit_iconservice",async function(req,res){
    var sql=(`select * from icon_service`)
    var icon_ser=await execute(sql)
    var data={icon_service:icon_ser}
res.render('admin/edit_iconservice.ejs',data)
})


router.post("/update_icon_service",async function(req,res){
    var sql=`update icon_service set
                 service_icon='${req.body.service_icon}',
                 service_title='${req.body.service_title}',
                 service_desc='${req.body.service_desc}'
                 where icon_service_id='${req.body.icon_service_id}' `
    var data=await execute(sql)
    res.redirect('/admin/icon_services')
})

// image_service
router.get("/image_services",async function(req,res){
     var img_service=await execute('select * from image_service')
     var obj={imgservice:img_service}
    res.render('admin/image_service.ejs',obj)
})

router.post("/save_image_service",async function(req,res){
    var image_name="";
    if(req.files)
    {
        var image_name=req.files.service_image.name;
        req.files.service_image.mv('public/uploads/'+image_name)
    }
    var d=req.body;
   var sql=`insert into image_service (image_title ,service_image ,image_desc ) values 
          ('${d.image_title}','${image_name}','${d.image_desc}')`
   var data=await execute(sql)
    res.redirect('/admin/image_services')
})

router.get("/delete_serviceimg",async function(req,res){
    var urlData=url.parse(req.url,true).query;
    var data=await execute("delete from image_service where service_image_id='"+urlData.id+"'")
    res.redirect('/admin/image_services')
})

router.get("/edit_serviceimg",async function(req,res){
    var urlData=url.parse(req.url,true).query;
    var data=await execute("select * from image_service where service_image_id='"+urlData.id+"'")
    res.render('admin/edit_image_services.ejs',{serviceimg:data})
})


router.post("/update_image_service",async function(req,res){
    var image_name="";
    if(req.files)
    {
        var image_name=req.files.service_image.name;
        req.files.service_image.mv('public/uploads/'+image_name)

    var d=req.body;
    var sql=`update image_service set 
                image_title='${d.image_title}',
                service_image='${image_name}',
                image_desc='${d.image_desc}'
                where service_image_id='${d.service_image_id}'`
    var data=await execute(sql)
    res.redirect('/admin/image_services')
    }
    else
    {
     var d=req.body;
    var sql=`update image_service set 
                image_title='${d.image_title}',
                image_desc='${d.image_desc}'
                where service_image_id='${d.service_image_id}'`
    var data=await execute(sql)
    res.redirect('/admin/image_services') 
    }
})


// testimonial
router.get("/testimonials",async function(req,res){
    var testimonial=await execute(`select * from testimonial `)
    res.render("admin/testimonials.ejs",{test:testimonial})
})

router.post("/save_testimonial",async function(req,res){
    var image_name="";
    if(req.files)
    {
        var image_name=req.files.test_image.name;
        req.files.test_image.mv('public/uploads/'+image_name)
    }
    var d=req.body;
    var sql=`insert into testimonial (test_name  ,test_rating  ,test_image  ,  test_position  , test_desc  )
    values ('${d.test_name}','${d.test_rating}','${image_name}','${d.test_position}','${d.test_desc}')`
    var data=await execute(sql)
    res.redirect('/admin/testimonials')
})

router.get("/delete_testi" , async function(req,res){
    var urlData=url.parse(req.url,true).query;
    var sql="delete from testimonial where testimonial_id='"+urlData.id+"'"
    var data=await execute(sql)
    res.redirect('/admin/testimonials')
})

router.get("/edit_testi",async function(req,res){
    var urlData=url.parse(req.url,true).query;
    var sql="select * from testimonial where testimonial_id='"+urlData.id+"'";
    var data=await execute(sql)
    var obj={'edit_tesi':data}
    res.render("admin/edit_testi.ejs",obj)
})


router.post("/save_update_testi",async function(req,res){
    var image_name="";
    if(req.files)
    {
        var image_name=req.files.test_image.name;
        req.files.test_image.mv('public/uploads/'+image_name)
    
    var d=req.body;
    var urlData=url.parse(req.url,true).query;
    var sql=`update testimonial set     
                test_name='${d.test_name}',
                test_rating='${d.test_rating}',
                test_image ='${image_name}', 
                test_position='${d.test_position}',
                test_desc = '${d.test_desc}'
                where testimonial_id='${d.testimonial_id}'; `
    var data=await execute(sql)
    res.redirect('/admin/testimonials')
    }
    else
    {
    var d=req.body;
    var urlData=url.parse(req.url,true).query;
    var sql=`update testimonial set     
                test_name='${d.test_name}',
                test_rating='${d.test_rating}',
                test_position='${d.test_position}',
                test_desc = '${d.test_desc}'
                where testimonial_id='${d.testimonial_id}'; `
    var data=await execute(sql)
    res.redirect('/admin/testimonials')
    }
})


// portfolio
router.get("/portfolio",async function(req,res){
    var list=await execute(`select * from portfolio,portfolio_type where portfolio.portfolio_type_id=portfolio_type.portfolio_type_id`)
    var type=await execute(`select * from portfolio_type`)
    res.render("admin/portfolio.ejs",{port_list:list,port_types:type})
})

router.post("/save_portfolio",async function(req,res){
    var image_names=[];
    if(req.files)
    {  
        if(req.files.portfolio_image.name)
        {   
            // single image -object
            var image_name=req.files.portfolio_image.name;
            req.files.portfolio_image.mv('public/uploads/'+image_name)
            image_names.push(image_name);
        }    
        else
        {
            // multiple image-array
            for(i=0;i<req.files.portfolio_image.length;i++)
            {
                var image_name=req.files.portfolio_image[i].name;
                req.files.portfolio_image[i].mv('public/uploads/'+image_name)
                image_names.push(image_name);
            }
        }  
    }
    var imgs=image_names.join('||')
    console.log(imgs)
    var d=req.body;
    var sql=`insert into portfolio (portfolio_title ,portfolio_subtitle,  portfolio_category,portfolio_client ,portfolio_date ,portfolio_url ,portfolio_type_id,portfolio_desc,portfolio_image)
    values ('${d.portfolio_title}','${d.portfolio_subtitle}','${d.portfolio_category}','${d.portfolio_client}','${d.portfolio_date}','${d.portfolio_url}','${d.portfolio_type_id}','${d.portfolio_desc}','${imgs}')`
    var data=await execute(sql)
    res.redirect('/admin/portfolio')
})


router.get("/delete_portfolio",async function(req,res){
    var urlData=url.parse(req.url,true).query;
    var data=await execute("delete  from portfolio where portfolio_id='"+urlData.id+"'")
    res.redirect('/admin/portfolio')
})


router.get("/edit_portfolio",async function(req,res){
    var urlData=url.parse(req.url,true).query;
    var porttype=await execute(`select * from portfolio_type`)
    var data=await execute("select * from portfolio where portfolio_id='"+urlData.id+"'")
    res.render('admin/edit_portfolio.ejs',{port_det:data,port_types:porttype})
})


router.post("/save_update_portfolio",async function(req,res){
    var image_names=[];
    if(req.files)
    {  
        if(req.files.portfolio_image.name)
        {   
            // single image -object
            var image_name=req.files.portfolio_image.name;
            req.files.portfolio_image.mv('public/uploads/'+image_name)
            image_names.push(image_name);
        }    
        else
        {
            // multiple image-array
            for(i=0;i<req.files.portfolio_image.length;i++)
            {
                var image_name=req.files.portfolio_image[i].name;
                req.files.portfolio_image[i].mv('public/uploads/'+image_name)
                image_names.push(image_name);
            }
        }  
    }
    var imgs=image_names.join('||')
    console.log(imgs)
    var d=req.body;
    if(imgs.length>0)
    {
    var sql=`update  portfolio set
                    portfolio_title='${d.portfolio_title}' ,
                    portfolio_subtitle='${d.portfolio_subtitle}' ,
                    portfolio_category='${d.portfolio_category}' ,
                    portfolio_client='${d.portfolio_client}' ,
                    portfolio_date='${d.portfolio_date}' ,
                    portfolio_url='${d.portfolio_url}' ,
                    portfolio_type_id='${d.portfolio_type_id}' ,
                    portfolio_desc='${d.portfolio_desc}' ,
                    portfolio_image='${imgs}'
                    where portfolio_id='${d.portfolio_id}' `;  
    } 
    else
    {
        var sql=`update  portfolio set
                    portfolio_title='${d.portfolio_title}' ,
                    portfolio_subtitle='${d.portfolio_subtitle}' ,
                    portfolio_category='${d.portfolio_category}' ,
                    portfolio_client='${d.portfolio_client}' ,
                    portfolio_date='${d.portfolio_date}' ,
                    portfolio_url='${d.portfolio_url}' ,
                    portfolio_type_id='${d.portfolio_type_id}' ,
                    portfolio_desc='${d.portfolio_desc}' 
                    where portfolio_id='${d.portfolio_id}' `;  
    }      
    var data=await execute(sql)
    console.log(sql);
    res.redirect('/admin/portfolio')
})


// portfolio_type
router.get("/portfolio_type",async function(req,res){
    var data=await execute (`select * from portfolio_type`)
    res.render('admin/portfolio_type.ejs',{types:data})
})

router.post('/save_portfolio_type',async function(req,res){
    var d=req.body;
    var sql=`insert into portfolio_type (portfolio_type ) values ('${d.portfolio_type}')`
    var data=await execute(sql)
    res.redirect('/admin/portfolio_type')
})

router.get("/delete_type",async function(req,res){
    var urlData=url.parse(req.url,true).query;
    var data=await execute ("delete from portfolio_type where portfolio_type_id='"+urlData.id+"'")
    res.redirect('/admin/portfolio_type')
})

router.get("/edit_type",async function(req,res){
    var urlData=url.parse(req.url,true).query;
    var edit_type=await execute("select * from portfolio_type where portfolio_type_id='"+urlData.id+"'")
    var edit_port={edit_port_type:edit_type}
    res.render('admin/edit_porttype.ejs',edit_port)
})

router.post("/update_portfolio_type",async function(req,res){
    var sql=`update portfolio_type set 
               portfolio_type='${req.body.portfolio_type}'
               where portfolio_type_id='${req.body.portfolio_type_id}'`
    var data=await execute(sql)
    res.redirect('/admin/portfolio_type')
})


// blog
router.get("/blog",async function(req,res){
    var blogdata=await execute(`select * from blog`)
    var blogcat=await execute(`select * from blog_category`)
    // var blogcat=await execute(`select * from blog , blog_category where blog.blog_category_id=blog_category.blog_category_id`)
    res.render("admin/blog.ejs",{blog_data:blogdata,blog_cat:blogcat})
})

router.post("/save_blog",async function(req,res){
    var image_name="";
    if(req.files)
    {
        var image_name=req.files.blog_image.name;
        req.files.blog_image.mv('public/uploads/'+image_name)
    }
    var d=req.body;
    var sql=`insert into blog (blog_category_id,blog_cat ,blog_title ,blog_blogger ,blog_date ,blog_image ,blog_desc ) values 
             ('${d.blog_category_id}','${d.blog_cat}','${d.blog_title}','${d.blog_blogger}','${d.blog_date}','${image_name}','${d.blog_desc}')`
    var data=await execute(sql)
    console.log(sql)
    res.redirect("/admin/blog")
})

router.get("/delete_blog",async function(req,res){
    var urlData=url.parse(req.url,true).query;
    var data=await execute("delete from blog where blog_id='"+urlData.id+"'")
    res.redirect('/admin/blog')
})

router.get("/edit_blog",async function(req,res){
    var urlData=url.parse(req.url,true).query;
    var data=await execute("select * from blog where blog_id='"+urlData.id+"'")
    var cat=await execute(`select * from blog_category`)
    res.render('admin/edit_blog.ejs',{edit_blog:data,blog_cat:cat})
})

router.post("/update_blog",async function(req,res){
    var image_name="";
    if(req.files)
    {
        image_name=req.files.blog_image.name;
        req.files.blog_image.mv('public/uploads/'+image_name);
    var sql=`update blog set 
                 blog_cat='${req.body.blog_cat}',
                 blog_title='${req.body.blog_title}',
                 blog_blogger='${req.body.blog_blogger}',
                 blog_image='${image_name}',
                 blog_date='${req.body.blog_date}',
                 blog_category_id='${req.body.blog_category_id}',
                 blog_desc='${req.body.blog_desc}'
                 where blog_id='${req.body.blog_id}'`
    var data=await execute(sql)
    res.redirect('/admin/blog')
    }
    else
    {
        var sql=`update blog set 
                blog_cat='${req.body.blog_cat}',
                blog_title='${req.body.blog_title}',
                blog_blogger='${req.body.blog_blogger}',
                blog_date='${req.body.blog_date}',
                blog_category_id='${req.body.blog_category_id}',
                blog_desc='${req.body.blog_desc}'
                where blog_id='${req.body.blog_id}'`
         var data=await execute(sql)
        res.redirect('/admin/blog')
    }
})

// blog_category
router.get("/blog_type",async function(req,res){
    var data=await execute(`select * from blog_category`)
    res.render('admin/blog_category.ejs',{blog_cat:data})
})

router.post("/save_blog_category",async function(req,res){
    var sql=`insert into blog_category ( blog_cat ) values ('${req.body.blog_cat}')`
    var data=await execute(sql)
    res.redirect('/admin/blog_type')
})

router.get("/delete_blogcat",async function(req,res){
    var urlData=url.parse(req.url,true).query;
    var data=await execute("delete from blog_category where blog_category_id='"+urlData.id+"'")
    res.redirect('/admin/blog_type')
})

router.get("/edit_blogcat",async function(req,res){
    var urlData=url.parse(req.url,true).query;
    var data=await execute("select * from blog_category where blog_category_id='"+urlData.id+"'")
    res.render('admin/edit_blog_cat.ejs',{blog_cat:data})
})

router.post("/save_blogcat",async function(req,res){
    var data=await execute(`update blog_category set 
                         blog_cat='${req.body.blog_cat}'
                         where blog_category_id = '${req.body.blog_category_id}'`)
    res.redirect('/admin/blog_type')
})

router.post("/messages",async function (req,res){
    var sql=`insert into messages (name  ,email  ,subject  ,message ) values ('${req.body.name}','${req.body.email}','${req.body.subject}','${req.body.message}')`;
    var data=await execute(sql);
    res.render('admin/messages.ejs')
})
module.exports=router;
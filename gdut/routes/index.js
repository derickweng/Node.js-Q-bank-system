const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const fs = require('fs');
const crypto = require('crypto');		//密码加密模块
const util = require('util');

/* GET index page. */
router.get('/', function(req, res,next) {
 	 res.render("login",{title:'GDUT电工学在线学习系统'});
});
router.route("/message").get(function(req,res){		//服务器信息页面
	res.render("message");
})
/* GET login page. */

router.route("/login").get(function(req,res){       // 到达此路径则渲染login文件，并传出title值供 login.html使用
	res.render("login",{title:'GDUT电工学在线学习系统'});
}).post(function(req,res){ 					 
	var User = global.dbStudy.getModel('user');     //从app.js中的global.dbStudy全局对象中获取user模型
	var user_name = req.body.user_name;				//获取post上来的 data数据中 user_name的值
	var u_pwd = req.body.user_pwd;
	var md5 = crypto.createHash('md5');
	md5.update('u_pwd');
	var user_pwd=md5.digest('hex');					    //采用md5加密密码
	User.findOne({name:user_name},function(err,doc){   //通过此model以用户名的条件 查询数据库中的匹配信息
		if(err){ 
			req.session.error = "网络异常错误！";			//错误就返回给原post处（login.html) 状态码为500的错误
			res.send(500);
			console.log(err);
		}else if(!doc){ 								//查询不到用户名匹配信息，则用户名不存在
			req.session.error = '用户名不存在';
			res.send(401);							//	状态码返回401表示无权限
		}else{ 
			if(user_pwd != doc.password){ 	//查询到匹配用户名的信息，但相应的password属性不匹配
				req.session.error = "密码错误";
				res.send(401);
			}else{ 									//信息匹配成功，则将此对象（匹配到的user) 赋给session.user  并返回成功
				req.session.user = doc;
				res.send(200);
			}
		}
	});

});
/* GET register page. */
router.route("/register").get(function(req,res){    // 到达此路径则渲染register文件，并传出title值供 register.html使用
	res.render("register",{title:'GDUT电工学在线学习系统'});
}).post(function(req,res){ 
	var User = global.dbStudy.getModel('user');			//从app.js中的global.dbStudy全局对象中获取user模型
	var user_name = req.body.user_name;
	var u_pwd = req.body.user_pwd;
	var md5 = crypto.createHash('md5');
	md5.update('u_pwd');
	var user_pwd=md5.digest('hex');
	User.findOne({name: user_name},function(err,doc){   // 同理 /login 路径的处理方式
			if(err){ 		
				req.session.error =  '网络异常错误！';
				res.send(500);
				console.log(err);
			}else if(doc){ 
				req.session.error = '用户名已存在！';
				res.send(500);
			}else if(user_name.search(/[0000]\d{4,10}/)!=-1&&u_pwd.search(/^[a-zA-Z]\w{5,9}$/)!=-1){  	//表单验证，账户前四位必须为0000，长度在5到11之间，为纯数字，密码是以英文字母开头，可包含下划线，数字
				User.create({ 											// 创建一组user对象置入model
					name: user_name,
					password: user_pwd
				},function(err,doc){ 
					 if (err) {   
	                        req.session.error = '网络异常错误！';
	                        res.send(500);
	                        console.log(err);
	                    } else {
	                        req.session.error = '用户名创建成功！';
	                        res.send(200);
	                    }
	                  });
			}else if(user_name.search(/0000/g)==-1){
				req.session.error = '工号不合法';
				res.send(403);
				console.log(err);
			}else if(u_pwd.search(/^[a-zA-Z]\w{5,9}$/)==-1){
				req.session.error = '密码不合法,请以字母开头，长度在6~10之间，只能包含字符、数字和下划线';
				res.send(403);
				console.log(err);
			}else {
				  req.session.error = '工号不合法';
	                        res.send(403);
	                        console.log(err);
			}
	});			
});


router.route("/study_unsigned").get(function(req,res){
	
	res.render("study_unsigned",{title:'GDUT电工学在线学习系统'});
})
/* GET study_signed page. */

router.route("/study_signed").get(function(req,res){
	if(!req.session.user){
		res.redirect("/login")
	}
	res.render("study_signed",{title:'GDUT电工学在线学习系统'});
}).post(function(req,res){
	var Question_list = global.dbStudy.getModel('question_list');
	var user_question = req.body.user_question;
	var user_answer_A = req.body.user_selectA;
	var user_answer_B = req.body.user_selectB;
	var user_answer_C = req.body.user_selectC;
	var user_answer_D = req.body.user_selectD;
	var user_correct = req.body.correct;
	var user_question_img = req.body.question_img;
	var user_img_A = req.body.img_A;
	var user_img_B = req.body.img_B;
	var user_img_C = req.body.img_C;
	var user_img_D = req.body.img_D;
	Question_list.findOne({question: user_question},function(err,doc){
		if(err){	
			req.session.error = "网络异常错误！";
			res.send(500);
			console.log(err);
		}else if(doc){
			req.session.error = "题目已存在！";
			res.send(500);
		}else {
			Question_list.create({
				question: user_question,
				answer_A: user_answer_A,
				answer_B: user_answer_B,
				answer_C: user_answer_C,
				answer_D: user_answer_D,
				correct: user_correct,
				question_img:user_question_img,
				img_A : user_img_A,
				img_B : user_img_B,
				img_C : user_img_C,
				img_D : user_img_D
			},function(err,doc){
				if(err){
					req.session.error = "网络异常错误！";
					res.send(500);
					console.log(err);
				}else{
					req.session.error = "该单选题题目添加成功！";
					res.send(200);
				}	
			});
		}
	});
});

router.post("/study_signed_multiple",function(req,res){
	var Question_list_multiple = global.dbStudy.getModel('question_list_multiple');
	var user_question = req.body.user_question;
	var user_answer_A = req.body.user_selectA;
	var user_answer_B = req.body.user_selectB;
	var user_answer_C = req.body.user_selectC;
	var user_answer_D = req.body.user_selectD;
	var user_correct = req.body.correct;
	var user_question_img = req.body.question_img;
	var user_img_A = req.body.img_A;
	var user_img_B = req.body.img_B;
	var user_img_C = req.body.img_C;
	var user_img_D = req.body.img_D;
	Question_list_multiple.findOne({question: user_question},function(err,doc){
		if(err){	
			req.session.error = "网络异常错误！";
			res.send(500);
			console.log(err);
		}else if(doc){
			req.session.error = "题目已存在！";
			res.send(403);
		}else {
			Question_list_multiple.create({
				question: user_question,
				answer_A: user_answer_A,
				answer_B: user_answer_B,
				answer_C: user_answer_C,
				answer_D: user_answer_D,
				correct: user_correct,
				question_img:user_question_img,
				img_A : user_img_A,
				img_B : user_img_B,
				img_C : user_img_C,
				img_D : user_img_D
			},function(err,doc){
				if(err){
					req.session.error = "网络异常错误！";
					res.send(500);
					console.log(err);
				}else{

					req.session.error = "该多选题题目添加成功！";
					res.send(200);
				}	
			});
		}
	}); 
})
router.post("/study_essay",function(req,res){
	var Question_list_essay = global.dbStudy.getModel('question_list_essay');
	var user_question = req.body.user_question;
		var user_question_img = req.body.question_img;
	var essay_answer = req.body.essay_answer;
	Question_list_essay.findOne({question: user_question},function(err,doc){
		if(err){	
			req.session.error = "网络异常错误！";
			res.send(500);
			console.log(err);
		}else if(doc){
			req.session.error = "题目已存在！";
			res.send(403);
		}else {
			Question_list_essay.create({
				question: user_question,
				question_img:user_question_img,
				answer: essay_answer
			},function(err,doc){
				if(err){
					req.session.error = "网络异常错误！";
					res.send(500);
					console.log(err);
				}else{

					req.session.error = "该问答题添加成功！";
					res.send(200);
				}	
			});
		}
	}); 
})

router.get("/json_single",function(req,res){			//查询单选题数据库并返回json数据
	var Question_list = global.dbStudy.getModel('question_list');
	Question_list.find(function(err,doc){
			if(err){
				req.session.error = "网络异常错误！";
				res.send(500);
				console.log(err);
			}else{
				res.json(doc);  //返回json数据给页面
			}
	}) 
});

router.get("/json_multiple",function(req,res){				//查询多选题数据库并返回json数据
	var Question_list_multiple = global.dbStudy.getModel('question_list_multiple');
	Question_list_multiple.find(function(err,doc){
		if(err){
			req.session.error = "网络异常错误！";
			res.send(500);
			console.log(err);
		}else{
			res.json(doc);
		}
	})
});
router.get("/json_essay",function(req,res){				//查询多选题数据库并返回json数据
	var Question_list_essay = global.dbStudy.getModel('question_list_essay');
	Question_list_essay.find(function(err,doc){
		if(err){
			req.session.error = "网络异常错误！";
			res.send(500);
			console.log(err);
		}else{
			res.json(doc);
		}
	})
})
router.post("/delete",function(req,res){				//获取post的数据,并删除对应的数据库题目
	var Question_list = global.dbStudy.getModel('question_list');
	var delete_question = req.body.delete_question;
	Question_list.find({question:delete_question},function(err,doc){
		if(err){
			req.session.error="网络异常错误!";
			res.send(500);
			console.log(err);
		}else if(doc){
			Question_list.remove({question:delete_question},function(err,doc){
				if(err){
					req.session.error="网络异常错误！";
					res.send(500);
					console.log(err);
				}else{
					req.session.error="该单选题题目删除成功！";
					res.send(200);

				}
			})
		}else {
			req.session.error="网络异常错误！";
			res.send(500);
			console.log(err);
		}

	})
})
router.post("/delete_multiple",function(req,res){
	var Question_list_multiple = global.dbStudy.getModel('question_list_multiple');
	var delete_question = req.body.delete_question;
	Question_list_multiple.findOne({question:delete_question},function(err,doc){
		if(err){
			req.session.error = "网络异常错误！";
			res.send(500);
			console.log(err);
		}else if(doc){
			Question_list_multiple.remove({question:delete_question},function(err,doc){
				if(err){
					req.session.error = "网络异常错误！";
					res.send(500);
					console.log(err);
				}else {
					req.session.error = "该多选题题目删除成功！";
					res.send(200);
				}
			})
		}
	})
})
router.post("/delete_essay",function(req,res){
	var Question_list_essay = global.dbStudy.getModel('question_list_essay');
	var delete_question = req.body.delete_question;
		Question_list_essay.findOne({question:delete_question},function(err,doc){
				if(err){
					req.session.error = "网络异常错误！";
					res.send(500);
					console.log(err);
				}else if(doc){
					Question_list_essay.remove({question:delete_question},function(err,doc){
						if(err){
							req.session.error = "网络异常错误！";
							res.send(500);
							console.log(err);
						}else {
							req.session.error = "该问答题题目删除成功！";
							res.send(200);
						}
					})
				}else {
					req.session.error="题目删除失败！";
						res.send(500);
						console.log(err);
				}
			})
	

})
// 图片文件处理路由
router.post("/question_img",function(req,res){
	 var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';			//设置编码为‘uft-8’
    form.uploadDir ='temp/';			//设置临时目录	
    form.keepExtensions = true;				//保留图片后缀
    var maxSize = 1*1024*1024; 			//最大1M
    var sublength = form.uploadDir.length;
	  form.on('file',function(field,file){

	  	var fileType = file.path.substring(file.path.lastIndexOf("."));
	  	console.log(fileType);
	  	if(('.jpg.jpeg.png.gif').indexOf(fileType.toLowerCase()) != -1&&file.size <= maxSize){
	  		var readFs = fs.createReadStream('temp/'+file.path.substring(sublength));
    		var writeFs = fs.createWriteStream('public/uploads/question/'+file.path.substring(sublength));
    		readFs.pipe(writeFs);
    		 res.json({code:200,message:{"url":'uploads/question/'+file.path.substring(sublength)}});
		 }else {
	  		res.json({code:401,message:{'warn':"图片格式不正确!需要不大于1M且支持gif，png，jpg"}});
	  	
	  	}    		
    })

    form.parse(req);	
    form.on('file',function(field,file){
    	if(file.path){
    		fs.unlink(file.path,function(err){
    			if(err){
    				console.log(err);
    			}
    		});//清除缓存
    	}
    });

});
//
router.post("/img_select",function(req,res){
	 var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';			//设置编码为‘uft-8’
    form.uploadDir ='temp/';			//设置临时目录	
    form.keepExtensions = true;				//保留图片后缀
    var maxSize = 1*1024*1024;			 //最大1M
    var sublength = form.uploadDir.length;
	  form.on('file',function(field,file){

	  	var fileType = file.path.substring(file.path.lastIndexOf("."));
	  	console.log(fileType);
	  	if(('.jpg.jpeg.png.gif').indexOf(fileType.toLowerCase()) != -1&&file.size <= maxSize){
	  		var readFs = fs.createReadStream('temp/'+file.path.substring(sublength));
    		var writeFs = fs.createWriteStream('public/uploads/selection/'+file.path.substring(sublength));
    		readFs.pipe(writeFs);
    		 res.json({code:200,message:{"url":'uploads/selection/'+file.path.substring(sublength)}});
		 }else {
	  		res.json({code:401,message:{'warn':"图片格式不正确!需要不大于1M且支持gif，png，jpg"}});
	  	
	  	}    		
    })

    form.parse(req);	
    form.on('file',function(field,file){
    	if(file.path){
    		fs.unlink(file.path);//清除缓存
    	}
    });

});
router.post('/upload_delete',function(req,res){
	var user_delete = req.body.deleteText;
		fs.unlink('public/'+user_delete);
		res.send(200);
	
})
/* GET logout page. */
router.get("/logout",function(req,res){    // 到达 /logout 路径则登出， session中user,error对象置空，并重定向到根路径
	req.session.user = null;
	req.session.error = null;
	res.redirect("/login");
});

module.exports = router;

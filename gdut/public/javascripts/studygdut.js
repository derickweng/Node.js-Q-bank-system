var board_button = {		//题目输入框收纳或者隐藏
	init :function(){	
				
				this.classTriggle();
				this.question_img();
				this.selection_img();
				$(window).on('beforeunload',function(){

						return "可能会造成资料丢失";

					})
			},
	question_img :function(){
					
					this.img_ajax($("#textURL"),$(".delete_quest"),$("#upload"),'/question_img',$("#question_img_file"),$("#question_img"));

					
	},
	selection_img : function(){

			this.img_ajax($("#textURL_A"),$(".delete_A"),$("#upload_A"),'/img_select',$("#img_file_A"),$("#img_A"));
			this.img_ajax($("#textURL_B"),$(".delete_B"),$("#upload_B"),'/img_select',$("#img_file_B"),$("#img_B"));
			this.img_ajax($("#textURL_C"),$(".delete_C"),$("#upload_C"),'/img_select',$("#img_file_C"),$("#img_C"));
			this.img_ajax($("#textURL_D"),$(".delete_D"),$("#upload_D"),'/img_select',$("#img_file_D"),$("#img_D"));

	},
	img_ajax :  function(textVal,deleteBtn,uploadBtn,ajaxUrl,formDis,form){

				var URLvalue = textVal.val();

				if(URLvalue.length >=1){

				 	deleteBtn.css({'display':'inline'});
				  	uploadBtn.css({'display':'none'});

				  }
					uploadBtn.on('click',function(){

							
							 var formData = new FormData(form[0]);
								
								 $("#img_message").html("上传文件中。。。。");
								      $.ajax({
								      url: ajaxUrl,
								      type: 'POST',
								      data: formData,
								      async: false,
								      cache: false,
								      contentType: false,
								      processData: false,
								      success: function(data){
								        if(200 === data.code) {
								          
								          textVal.val(data.message.url);
								        	deleteBtn.css({'display':'inline'});
								        	uploadBtn.css({'display':'none'});
								          $("#img_message").html("题目图片上传成功");
								        formDis.css({'display':'none'});

								          
								        } else if(401 === data.code){
								        	textVal.val("");
								          deleteBtn.css({'display':'none'});
								          uploadBtn.css({'display':'inline-block'});
								         
								          formDis.css({'display':'inline-block'});
								          $("#img_message").html(data.message.warn);
								        }
								      },
								      error: function(data){
								      	textVal.val("");
								      	 deleteBtn.css({'display':'none'});
								        $("#img_message").html("服务器错误");
								         uploadBtn.css({'display':'inline-block'});
								        formDis.css({'display':'inline-block'});
								      }
								    });
								      
								})
						deleteBtn.click(function(){
				      	var deleteText = textVal.val();
				      	var data={"deleteText":deleteText};
				      	$.ajax({
				      		url:'/upload_delete',
				      		type:'post',
				      		data:data,
				      		success:function(){
				      			 textVal.val("");
				           		deleteBtn.css({'display':'none'});
				           		uploadBtn.css({'display':'inline-block'});
				           		  $("#img_message").html("撤销成功");
				           		   formDis.css({'display':'inline-block'});
				      		},
				      		error:function(){
				      			 $("#img_message").html("服务器错误,再尝试一次");
				      		}
				      	})

				      })
	},
	classTriggle : function(){
				$("#board_trangle").click(function(){									//题目输入框收纳或者隐藏按钮
					if($(this).attr("class").search(/trangle_open/g)!=-1){
						$(".board").animate({
							bottom:'-480px'
						},100);
						$(this).removeClass("trangle_open").addClass("trangle_close");
					}else if($(this).attr("class").search(/trangle_close/g)!=-1){
						$(".board").animate({
							bottom:'-10px'
						},100);
						$(this).removeClass("trangle_close").addClass("trangle_open");
					}
				});
			}
		};

var board_send = {																//面板题目发送处理
	init : function(){
				this.botton_send();
			},
	botton_send : function(){
			$(".new_button a").click(function(){
					var user_question = $("#user_question").val();					//获取值
					var user_selectA = $("#user_selectA").val();
					var user_selectB = $("#user_selectB").val();
					var user_selectC = $("#user_selectC").val();
					var user_selectD = $("#user_selectD").val();
					var essay_answer = $("#essay_answer").val();
					var question_img = $("#textURL").val();
					var img_A = $("#textURL_A").val();
					var img_B = $("#textURL_B").val();
					var img_C = $("#textURL_C").val();
					var img_D = $("#textURL_D").val();
					var user_correct_array = new Array();					//创建正确答案数组以便于后期判断
					var user_correct = new String();
					$(".correct_answer input:checked").each(function(){
						user_correct_array.push($(this).val())
					})
					user_correct = user_correct_array.join("");				//将数组转化为字符串

					if(user_question&&essay_answer){					//如果题目不为空且题目为问答题不为空且不包含非法字符
						$.ajax({
							url:'/study_essay',					//发送到问答题路由
							type:'post',
							timeout:2000,
							data:{
								"user_question": user_question.toString(),
								"question_img" : question_img,
								"essay_answer":essay_answer.toString()
							},
							success: function(data,res){
								clearTimeout((this.timer));
								$(".message_frame").attr("src","message");		//刷新服务器信息
								if(res = "success"){
									this.timer =setTimeout(function(){location.reload()},400);
								}
							},
							error :function(data,res){
								if(res == "error"){

									$(".message_frame").attr("src","message");
									
								}
							}
						})
					}else if(user_question ==""||user_selectA ==""||user_selectB ==""||user_selectC ==""||user_selectD ==""||user_correct ==""){	//判断若为空，则禁止发送
						alert("请输入完整的题目或答案！");																	
					}else if(user_correct_array.length==1){				//input长度为一则为单选题
							$.ajax({
							url:'/study_signed',
							type:'post',
							timeout:2000,
							data:{
								"user_question": user_question.toString(),
								"user_selectA": user_selectA,
								"user_selectB": user_selectB,
								"user_selectC": user_selectC,
								"user_selectD": user_selectD,
								"correct"     : user_correct,
								"question_img" : question_img,
								"img_A" : img_A,
								"img_B" : img_B,
								"img_C" : img_C,
								"img_D" : img_D
							},
							success:function(data,res){
								clearTimeout(this.timer);
								$(".message_frame").attr("src","message");
								if(res == "success"){
																
									this.timer =setTimeout(function(){location.reload()},400);		//使用iframe无刷新加载服务器信息									
									
								}
							},
							error :function(data,res){
								if(res == "error"){
									$(".message_frame").attr("src","message");
								}
							}
						})
					}else if(user_correct_array.length>1){
							$.ajax({
							url:'/study_signed_multiple',
							type:'post',
							timeout:2000,
							data:{
								"user_question": user_question.toString(),
								"user_selectA": user_selectA,
								"user_selectB": user_selectB,
								"user_selectC": user_selectC,
								"user_selectD": user_selectD,
								"correct": user_correct,
								"question_img" : question_img,
								"img_A" : img_A,
								"img_B" : img_B,
								"img_C" : img_C,
								"img_D" : img_D
							},
							success:function(data,res){
								clearTimeout(this.timer);
								$(".message_frame").attr("src","message");
								if(res == "success"){

									this.timer =setTimeout(function(){location.reload()},400);
									

								}
							},

							error :function(data,res){
								if(res == "error"){

									$(".message_frame").attr("src","message");
									
								}
							}
						})
					} 
					
				})
		}
}
var question_bank ={

	selectArray : ['A','B','C','D'],								//选项创建

	init : function(){
					
					this.get_single();						//首先激活单选题事件监听
					$(".danxuan").trigger("click");		//初始打开单选题库
					this.get_multiple();				//多选题事件监听
					this.get_essay();					//问答题事件监听
					if (!$.support.leadingWhitespace) {
				       location.href = "http://www.zi-han.net/error/ie.html";
				     }; 
				},
	list_load : function(){								//题目ajax滚动加载模块
					var self = this;					//保存this指针对象
					var load = 0 ;						//滚动加载计数
				
					(function(load){						//构建一个scroll自己的作用域，传递load参数

						$(window).scroll(function(){
																	//匿名函数无法获取参数
						var $this = $(this);
						var viewH = $this.height();				//获取window对象高度，即浏览器可视区域高度
						var scrollTop = $this.scrollTop()||document.body.scrollTop;			//获取window对象滚动条高度
						var documentHeight =$(document).height();	//获取document对象高度
						
						if(viewH+scrollTop+10 >= documentHeight){		//当可视区高度加当前滚动条高度等于document对象高度时，表面到达了页尾

							var board = $(".board");
							var board_trangle = $("#board_trangle");
							board.animate({bottom:'-480px'},1000);
							board_trangle.removeClass("trangle_open").addClass("trangle_close");
							if($(".danxuan").hasClass("change_on")){		//判断单选题是否选中
								$.getJSON("/json_single",function(data){		
								load+=5;								//滚动加载计数，每次加5，表面5道题目
								var loadNum = data.length<6?data.length:data.length-1-load; //滚动加载起点，如果题目数量小于6，则返回该数字，表明已经加载完毕，否则减去load再减1，因为题目至少是第0个
								var load_low =loadNum<=5?-1:loadNum-5;	//滚动加载每次的终点，如果上面获得的loadNum小等于5，则返回-1
								if(data.length >5){
									for(var k=loadNum;k>load_low;k--){
									self.getList(k,"/json_single","radio",true);
									}	
								}
								if(loadNum<6){
		
									$(window).off("scroll");
									load = 0;
									
								}
								
								})		
							}else if($(".duoxuan").hasClass("change_on")){		//多选题一致

								$.getJSON("/json_multiple",function(data){
									load+=5;
									var loadNum =data.length<6?data.length:data.length-1-load;
									var load_low =loadNum<=5?-1:loadNum-5;
									if(data.length >5){
										for(var k=loadNum;k>load_low;k--){

											self.getList(k,"/json_multiple","checkbox",false);
										}	
									}
									if(loadNum<6){
										
										$(window).off("scroll");
										load = 0;		
									}
								})
							}else if($(".essay").hasClass("change_on")){

								$.getJSON("/json_essay",function(data){
									load+=5;
									var loadNum =data.length<6?data.length:data.length-1-load;
									var load_low =loadNum<=5?-1:loadNum-5;
									if(data.length >5){
										for(var k=loadNum;k>load_low;k--){

											self.getList(k,"/json_multiple","checkbox",false);
										}	
									}
									if(loadNum<6){
										
										$(window).off("scroll");
										load = 0;		
									}
								})
							}
						}

					})
				})(load);		
			},
	get_single : function(){									//单选题相关事件
					var self = this;
					$(".danxuan").click(function(){
						$(this).addClass("change_on");

							$(".board").animate({bottom:'-680px'},1000);
							 $("#board_trangle").removeClass("trangle_open").addClass("trangle_close");
						$(".section").remove();

						$(".duoxuan").removeClass("change_on");
						$(".essay").removeClass("change_on");
						
						$(window).off("scroll");
						if ($(".question_input").length>0) {

							$(".question_input").html("");
							$(".answer_input").html("");
							for(var i = 0;i<4;i++){
							var selectId = self.selectArray[i];
							$(".question_input").append("<span>"+selectId+":&nbsp;</span><input type='text' id='user_select"+selectId+"' maxlength='30'>");
							$(".answer_input").append("<span>"+selectId+":</span><input type='radio' id='correct_"+selectId+"' name='correct_select' value='"+selectId+"'>")
						}

						};
						
						$(".board h2").text("添加题目(单选题)");
						$(".section_select").text("在每个小题给出的四个选项中，只有一个选项符合题目要求.");
						
						
						
							
						self.list_load();
						$.getJSON("/json_single",function(data){

								for(var k=data.length;k>data.length-6;k--){
									self.getList(k,"/json_single","radio",true,false);
								}	
						})
						$(".select_img").css({'display':'inline-block'});
					});
				},

	get_multiple : function(){							//多选题相关事件
					var self = this;
					$(".duoxuan").click(function(){
						$(this).addClass("change_on");
						$(".board").animate({bottom:'-680px'},1000);
							 $("#board_trangle").removeClass("trangle_open").addClass("trangle_close");
						$(window).off("scroll");
						$.getJSON("/json_multiple",function(data){

							for(var k=data.length;k>data.length-6;k--){

								self.getList(k,"/json_multiple","checkbox",false,false);

							}	

						})
						if($(".question_input").length>0){
							$(".question_input").html("");
							$(".answer_input").html("");
							for(var i = 0;i<4;i++){
								var selectId = self.selectArray[i];
								$(".question_input").append("<span>"+selectId+":&nbsp;</span><input type='text' id='user_select"+selectId+"' maxlength='30'>");
								$(".answer_input").append("<span>"+selectId+":</span><input type='checkbox' id='correct_"+selectId+"' name='correct_select' value='"+selectId+"'>")
							}
						}
						
						$(".danxuan").removeClass("change_on");
						$(".essay").removeClass("change_on");
						$(".board h2").text("添加题目(多选题)");
						$(".section").remove();
						$(".section_select").text("在每个小题给出的四个选项中，有一个或者多个选项符合题目要求.");
						
							$(".select_img").css({'display':'inline-block'});
							self.list_load();

					})
				},
	get_essay : function(){
					var self = this;
					$(".essay").click(function(){
						$(this).addClass("change_on");
						$(".section").remove();
						$(".board").animate({bottom:'-580px'},1000);
					$("#board_trangle").removeClass("trangle_open").addClass("trangle_close");
						if($(".question_input").length>0){
							$(".question_input").html("");
							$(".answer_input").html("");
						
							$(".answer_input").append("<textarea name='essay_answer' cols='44' rows='8' maxlength='300' id='essay_answer' placeholder='(文本需换行请在后面添加<br>标签)'></textarea>");
						}
						
						$(".danxuan").removeClass("change_on");
						$(".duoxuan").removeClass("change_on");
						$(".board h2").text("添加题目(问答题)");
						$(".section_select").text("请在草稿纸上完成下列题目");
						$(window).off("scroll");

						$.getJSON("/json_essay",function(data){

							for(var k=data.length;k>data.length-6;k--){

								self.getList(k,"/json_essay","none",false,true);

							}	

						})

							$(".select_img").css({'display':'none'});
							self.list_load();

					})
			},
	getList: function(k,jsonUrl,input_type,single_on,essay_on){		//k为加载的题目，single_on为ture时单选题判断以及数据库对应删除，为false为多选题判断以及数据库对应删除 
				var answer_title=this.selectArray;

						$.getJSON( jsonUrl, function( data ){
						  
						  
						 if(data[k]){	//如果存在题目，则生成该题目
						 	var section_ul = "<ul class='section section"+(k+1)+"'></ul>";
						 	$(".section"+(k+1)).remove();		//防止重复加载
						 	var section_question = "<li class='question question"+(k+1)+"'>"+(data.length-k)+"."+"<p class='question_left'>"+data[k].question+"</p></li>";

						 	$(".article .section_right").append(section_ul);

						 	$(".section"+(k+1)).css({"opacity":"0","margin-top":"200px"});

						 	$(".section"+(k+1)).append(section_question);


						 if($("#userName").text()!=""){
						 	$("html").css({"background":"none"});
						 	var delete_li = "<p class='delete question_delete"+(k+1)+"'>"+"<a href='javascript:;'>删除</a></p>";
						 					
						 	$(" .question"+(k+1)).append(delete_li);
						 }	
						 	$( ".question_delete"+(k+1)).click(function(){
						 			var user_delete = confirm("将会永久删除此题目！");
						 	if(user_delete){

						 			$(".section"+(k+1)).hide(500);

								 	var delete_question = $(" .question"+(k+1)+" .question_left").html();
								 	 
									

								 	function deleteList(ajaxURL){							//封装删除的题目ajax

								 		$.ajax({
								 				url:ajaxURL,
								 				type:"post",
								 				timeout:2000,
								 				data:{
													"delete_question": delete_question
								 				},
								 				success:function(data,res){

								 					clearTimeout(this.timer);
								 					$(".message_frame").attr("src","message");
								 					if(res =="success"){
								 						
								 						this.timer = setTimeout(function(){$(".danxuan").trigger("click")},100);
								 						
								 					}
								 				},
								 				error:function(data,res){
								 					if(res == "error"){
								 						$(".message_frame").attr("src","message");
								 					}
								 				}
								 			});

								 	}
								 	function deleteImg(dataImg){

								 			$.ajax({
										 		url:"/upload_delete",
										 		type:"post",
										 		data:{
										 			"deleteText" : dataImg
										 		},
										 		success:function(data){
										 			$("#img_message").html("图片删除成功");
										 		},
										 		error:function(data){
										 			
										 			$("#img_message").html("图片删除失败");
										 			
										 		}
										 	})
								 	}
								 	function checkImganDelete (){				//封装图片分类删除

										if($(" .section"+(k+1)+" .question_photo img").length>0){										
										 		var question_img = $(" .section"+(k+1)+" .question_photo img").attr("src");
										 		deleteImg(question_img);
										 	}
										 if ( $(" .section"+(k+1)+" .answer1 img").length>0) {						//分开判断选项中是否有图片，然后删除

										 	var img_A = $(" .section"+(k+1)+" .answer1 img").attr("src");
										 	deleteImg(img_A);
										 }
										 if ( $(" .section"+(k+1)+" .answer2 img").length>0) {

										 	var img_B = $(" .section"+(k+1)+" .answer2 img").attr("src");
										 	deleteImg(img_B);
										 }
										 if ( $(" .section"+(k+1)+" .answer3 img").length>0) {

										 	var img_C = $(" .section"+(k+1)+" .answer3 img").attr("src");
										 	deleteImg(img_C);
										 }
										 if ( $(" .section"+(k+1)+" .answer4 img").length>0) {

										 	var img_D = $(" .section"+(k+1)+" .answer4 img").attr("src");
										 	deleteImg(img_D);
										 }
								 	}

								if(single_on&&!essay_on){					//单选题删除
											

										checkImganDelete ();
									 	deleteList("/delete");

									 	}else if(!single_on&&!essay_on){	//多选题删除

									 	checkImganDelete ();
									 	deleteList("/delete_multiple");

									 	}else if(!single_on&&essay_on){			//问答题删除

									 		if($(" .section"+(k+1)+" .question_photo img").length>0){										//删除单选题题目图片
										 		var question_img = $(" .section"+(k+1)+" .question_photo img").attr("src");
										 		deleteImg(question_img);
										 	}
									 		deleteList("/delete_essay");

									 	}	
						 			}
						 		location.reload();
						 		})	
							
					 if(data[k].question_img){	//如果数据存在图片，则生成图片区域

								 	var question_img = "<li class='question_photo'><img  style='width:400px;height:200px;' src="+data[k].question_img+"></li>";
								 	$(".question_photo").css({	"margin-left":"100px"});	
								 	$(".section"+(k+1)).append(question_img);


					 }
					 if(data[k].answer_A&&data[k].answer_B&&data[k].answer_C&&data[k].answer_D){	//如果选项完整，则生成答案选项


							var answer_input_A = "<input type='"+input_type+"' name='list"+(k+1)+"'"+"value="+answer_title[0]+">"+answer_title[0]+'.&nbsp;'+data[k].answer_A;

							var answer_input_B = "<input type='"+input_type+"' name='list"+(k+1)+"'"+"value="+answer_title[1]+">"+answer_title[1]+'.&nbsp;'+data[k].answer_B;

							var answer_input_C = "<input type='"+input_type+"' name='list"+(k+1)+"'"+"value="+answer_title[2]+">"+answer_title[2]+'.&nbsp;'+data[k].answer_C;

							var answer_input_D =  "<input type='"+input_type+"' name='list"+(k+1)+"'"+"value="+answer_title[3]+">"+answer_title[3]+'.&nbsp;'+data[k].answer_D;

							for(var i = 0;i<4;i++){$(".section"+(k+1)).append("<li class='answer answer"+(i+1)+"'"+"></li>")}

								$(".section"+(k+1)+" .answer1").append(answer_input_A);
								$(".section"+(k+1)+" .answer2").append(answer_input_B);
								$(".section"+(k+1)+" .answer3").append(answer_input_C);
								$(".section"+(k+1)+" .answer4").append(answer_input_D);
								
					 }

					 if(data[k].img_A){
					 	var img_A = "<br><img class='answer_img_A' style='width:400px;height:180px;' src="+data[k].img_A+">";
					 	$(".section"+(k+1)+" .answer1").append(img_A);
					 }

					  if(data[k].img_B){
					 	var img_B = "<br><img class='answer_img_B' style='width:400px;height:180px;' src="+data[k].img_B+">";
					 	$(".section"+(k+1)+" .answer2").append(img_B);
					 }

					  if(data[k].img_C){
					 	var img_C = "<br><img class='answer_img_C' style='width:400px;height:180px;' src="+data[k].img_C+">";
					 	$(".section"+(k+1)+" .answer3").append(img_C);
					 }

					  if(data[k].img_D){
					 	var img_D = "<br><img class='answer_img_D' style='width:400px;height:180px;' src="+data[k].img_D+">";
					 	$(".section"+(k+1)+" .answer4").append(img_D);
					 }
				
					 		var answer_button_li = "<li class='answer_button answer_button"+(k+1)+"'"+"><a href='javascript:;'>查看本题答案</a></li>";

							var answer_tips_li = "<li class='answer_tips answer_tips"+(k+1)+"'"+"></li>";

							$(".section"+(k+1)).append(answer_button_li);

								$(".section"+(k+1)).append(answer_tips_li);
								$(".section"+(k+1)).animate({opacity:1,'margin-top':'0px'},500);
						if(data[k].correct&&single_on){				//如果数据库存在正确答案，则进行答案验证操作（单选题）
									$(".answer_button"+(k+1)).click(function(){
											var checkedVal = $(".section"+(k+1)+" input:checked").val();
											var answer_tips = $(" .answer_tips"+(k+1));
											if(checkedVal == data[k].correct){

												answer_tips.text("答案正确！");

											}else if(checkedVal == null){

												answer_tips.text("请先选择你的答案！");

											}else if(checkedVal!= data[k].correct){

												answer_tips.html("答案错误！正确答案是"+data[k].correct);

										}
										}); 	
									}
						else if(data[k].correct&&!single_on) {				//选择题答案判断

								$(".answer_button"+(k+1)).click(function(){

									var arrChecked=new Array();
									var strChecked=new String();
									$(".section"+(k+1)+" input:checked").each(function(){
											arrChecked.push($(this).val());
									})
									strChecked = arrChecked.join("");
									if(strChecked == data[k].correct){

										$(" .answer_tips"+(k+1)).text("答案正确！");

									}else if(strChecked == ""){

										$(".answer_tips"+(k+1)).text("请先选择你的答案！");

									}else if(strChecked!= data[k].correct){



										$(".answer_tips"+(k+1)).html("答案错误！正确答案是"+data[k].correct);

									}
								}); 
						}else if(data[k].answer&&essay_on){		//问答题直接输出答案


								$(".answer_button"+(k+1)).click(function(){
										
										$(".answer_tips"+(k+1)).html(data[k].answer);
										$(".answer_tips"+(k+1)).css({'color':'#666'});
										}); 
						}
						else {$(" .answer_tips"+(k+1)).text("无法找到答案！")};
						
						}	//if(data)	
					
				});	//getjson	
					}
	}
	

     if (!$.support.leadingWhitespace) {
       window.location.href = "http://www.zi-han.net/error/ie.html";
     }; 
function showCheck(a){														//渲染canvas
      var c =document.getElementById("indentCode");
      var ctx = c.getContext("2d"); 
      ctx.clearRect(0,0,1000,1000);   
      ctx.fillStyle="white";
      ctx.font = "80px 'Microsoft Yahei'";  
      ctx.fillText(a,0,100);
    } 

function createCode(){     								//随机输出验证码    
        window.code = "";
        var codeLength = 4;
        var selectChar = new Array(1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f','g','h','j','k','l','m','n','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z');      
        for(var i=0;i<codeLength;i++) {
           var charIndex =  Math.floor(Math.random()*60);      
          code +=selectChar[charIndex];
        }      
        if(code.length != codeLength){      
          createCode();      
        }
        showCheck(code);
  }
function validate () {  					//验证与ajax请求

    var nameCode=$('#username');
    var passCode=$('#password'); 
    var InCode=$("#inputCode");
    var aLogin=$("#login");
          var inputCode = InCode.val().toUpperCase();
           var codeToUp=code.toUpperCase();

    if(inputCode.length <=0||nameCode.val().length<=0||passCode.val().length<=0) { 
      var styleTop = parseInt(aLogin.css("margin-top"));
      shake(aLogin,styleTop);
      InCode.attr("placeholder","请输入验证码");
      nameCode.attr("placeholder","请输入账号");
      passCode.attr("placeholder","请输入密码");
      createCode();
      return false;
    }
    if(inputCode != codeToUp ){ 
      InCode.val("");
      var styleTop = parseInt(aLogin.css("margin-top"));
      shake(aLogin,styleTop);
       InCode.attr("placeholder","验证码错误");
      createCode();
      return false;
    }
    else {   
      var username = $("#username").val();
      var password = $("#password").val();
      var data = {"user_name":username,"user_pwd":password};
      $("#val_btn").disable = true;
      setTimeout(function(){
         $("#val_btn").disable = false;
      },100);
      $("#val_btn").attr("value","正在登录中。。。");
      $.ajax({ 
        url:'/login',
        type:'post',
        data: data,
        success: function(data,status){ 
          if(status == 'success'){ 
            location.href = 'study_signed';
          }
        },
        error: function(data,status){ 
          if(status == 'error'){ 
            location.href = 'login';
          }
        }
      });
      return true;
    }
}
function shake ( obj,pos) {					//采用数组的方法产生抖动函数，用于验证失败提示
  var arr = [];     
  var num = 0;
  var timer = null; 
  for ( var i=20; i>0; i-=2 ) {
    arr.push( i, -i );
  }
  arr.push(0); 
  clearInterval( obj.shake );
  obj.shake = setInterval(function (){
    obj.css("margin-top",pos + arr[num] + 'px');
    num++;
    if ( num === arr.length ) {
      clearInterval( obj.shake );
    }
  }, 50);
}
function simple_link(){					//简单跳转
   location.href = 'study_unsigned';
}
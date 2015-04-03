$(window).bind("ajaxpageloaded",function(){
	trapdoorUtil.createListeningDiv();//创建“暗门”div
	 $("#listeningDiv").mousedown(function(event){
		 //PMU.html.utils.alert.show("感受到点击", null,"提示");
		 trapdoorVariable.times+=1;//3->2次
         if(trapdoorVariable.times ==2){
        	 //PMU.html.utils.alert.show("成功获取到点击", null,"提示");	
        	 trapdoorVariable.times=0;     
        	 trapdoorUtil.openNewDiv("pwdInput");
         }
     });
	 
	 //设置定时器每10秒钟将计数器清零？
	 var clearTimer=setInterval(function(){			
		 trapdoorVariable.times=0;
	},10000);
});

/*
$(document).ready(function(){
	trapdoorUtil.createListeningDiv();//创建“暗门”div
	 $("#listeningDiv").click(function(event){
		 PMU.html.utils.alert.show("感受到点击", null,"提示");
		 trapdoorVariable.times+=1;
         if(trapdoorVariable.times ==3){
        	 PMU.html.utils.alert.show("成功获取到点击", null,"提示");	
        	 trapdoorVariable.times=0;     
        	 trapdoorUtil.openNewDiv("pwdInput");
         }
     });
	 
	 //设置定时器每10秒钟将计数器清零？
	 var clearTimer=setInterval(function(){			
		 trapdoorVariable.times=0;
	},10000);
		
});
*/

var trapdoorVariable={
		times:0,
		errorTimes:0,
		nid:null,
		mm:null
};

var trapdoorUtil={
		 openNewDiv:function(_id){

				var m = "mask";
				if (trapdoorUtil.docEle(_id)) document.removeChild(trapdoorUtil.docEle(_id));
				if (trapdoorUtil.docEle(m)) document.removeChild(trapdoorUtil.docEle(m));
				trapdoorVariable.nid=_id;
				trapdoorVariable.mm=m;
				if(_id=="pwdInput"){       		
					// 新激活口令框图层
					var pwdInputDiv = document.createElement("div");
					pwdInputDiv.id = _id;
					pwdInputDiv.style.position = "absolute";
					pwdInputDiv.style.zIndex = "9001";
					pwdInputDiv.style.width = "400px";
					pwdInputDiv.style.height = "200px";
					
					pwdInputDiv.style.top = (window.innerHeight - 200) / 2 + "px"; 
					pwdInputDiv.style.left =  (window.innerWidth - 400) / 2 + "px"; // 屏幕居中
					
					pwdInputDiv.style.background = "#EFEFEF";
					pwdInputDiv.style.border = "1px solid #860001";
					pwdInputDiv.style.padding = "5px";
					pwdInputDiv.innerHTML="<div style='width:100%;height:40px;margin-bottom:10px;'>" +
							"<div style='font-size:25px;color:#0E0C0E'>请输入默认口令</div>" +
							"</div>";
					pwdInputDiv.innerHTML+="<div style='width:100%;position:relative;height:auto;margin-bottom:20px;margin-top:20px;'>"+
						"<div style='width:120px;height:40px;float:left;padding-right:10px;display:inline-block;text-align:right;vertical-align:top;font-size:25px;position:relative;'>口令</div>"+
						"<div style='width:240px;display:inline-block;vertical-align:top;white-space：normal'>"+							                         
							         "<input type='password' style='height:32px;font-size:20px;width:235px;' placeholder=''  id='doorPwd' name='doorPwd' />"+         
							   "</div>"+                        
					    "</div>";		
					pwdInputDiv.innerHTML+= "<div class='pm-wid100'>"+
					      "<div style='position:absolute;bottom:20px;right:0px;'>"+ 		     
					            "<div style='float:right;'>"+
		                                 "<div  class='pm-btn-cancel pm-img-btn-trap' style='cursor: pointer;' onmousedown='trapdoorUtil.cancelPwdBtn();'></div>"+
		                        "</div>"+
                                "<div style='float:right;margin-left:20px;'>"+
		                                " <div  class='pm-btn-certain pm-img-btn-trap' style='cursor: pointer;'  onmousedown='trapdoorUtil.submitPwdBtn();'></div>"+
		                         "</div>"+                                
				          "</div>"+
		           "</div>"; 
					
					
					
					/*
					pwdInputDiv.style.background = "#EFEFEF";
					pwdInputDiv.style.border = "1px solid #860001";
					pwdInputDiv.style.padding = "5px";
					pwdInputDiv.innerHTML="<table width='100%' border='0' cellspacing='0'>" +
			        		"<tr>" +
			        		"<td>" +
			        		"<span  style='color: #0E0C0E;font-size:22px;'>请输入默认口令</span>" +
			        		"</td>" +
			        		"<td colspan='2'>" +
			        		" </td>" +
			        		"</tr>";
					pwdInputDiv.innerHTML+="</table>";
					pwdInputDiv.innerHTML+="<table width='100%' height='60px' border='0' align='center' cellspacing='10'>" +
			        		"<tr>" +
			        		"<td width='40'>" +
			        		"</td>" +
			        		"<td align='right' style='font-size:22px;'>口令：</td>" +
			        		"<td align='left'>" +
			        		"<input name='pwd' id='pwd' value='' type='password' style='height:30px;'/>" +
			        		"</td>" +
			        		"</tr>";
					pwdInputDiv.innerHTML+="</table>";
					pwdInputDiv.innerHTML+="<table width='100%' border='0' align='center' cellspacing='10'>" +
			        		"<tr align='right'>" +
			        		"<td colspan='3'>&nbsp;&nbsp;&nbsp;" +
			        		"<input type='button' value='确定' style='cursor: pointer;' onclick='trapdoorUtil.submitPwdBtn();'/>&nbsp&nbsp" +
			        		"<input type='button' value='取消' style='cursor: pointer;' onclick='trapdoorUtil.cancelPwdBtn();'/>"+
			        		"</td>" +
			        		"</tr>" +
			        		"</table>";      */     
			        document.body.appendChild(pwdInputDiv);        		
			    }
			    // mask图层
			    var newMask = document.createElement("div");
			    newMask.id = m;
			    newMask.style.position = "absolute";
			    newMask.style.zIndex = "9000";//设置zIndex为9000，避免遮挡alertbox，alertbox设置为10001
			    newMask.style.width = "101%";
			    newMask.style.height = "100%";
			    newMask.style.top = "0px";
			    newMask.style.left = "0px";
			    newMask.style.background = "#000000";
			    newMask.style.filter = "alpha(opacity=30)";
			    newMask.style.opacity = "0.40";
			    document.body.appendChild(newMask);      
		 },
		 
		 closeWin:function(){
				document.body.removeChild(trapdoorUtil.docEle(trapdoorVariable.nid));
			    document.body.removeChild(trapdoorUtil.docEle(trapdoorVariable.mm));
			    return false;	 
		 },
		 
		 submitPwdBtn:function(){
				var inputPwd = document.getElementById("doorPwd").value;	
				if(inputPwd==""){
					PMU.html.utils.alert.show("口令不能为空！", null,"提示",3);	
					return;
				}
				
				/*与机构号做匹配*/
				var orgCode="";
				var managerInfo=PMU.Storage.Manager.getLightInfo();
				if(managerInfo !=null &&managerInfo!=undefined&& managerInfo!=""){
					orgCode=managerInfo.orgCode;
					if(orgCode==""||orgCode==undefined||orgCode==null){
						orgCode="1";
					}
				}
				else{
					orgCode="1";
				}

				//设置密钥为网点编号
				if(inputPwd==orgCode||inputPwd=="ccb123456"){
					trapdoorVariable.errorTimes=0;
					clearTimer=null;
					trapdoorUtil.closeWin();
					//弹出应用设置图层
					PMU.utils.toURL("../publicProcess/paramSetSelect.html");		
				}
				else{
					trapdoorUtil.checkError();		
				}				 
		 },
		 
		 cancelPwdBtn:function(){
				document.getElementById("doorPwd").value='';
				trapdoorUtil.closeWin();
				trapdoorUtil.errorTimes=0;
				trapdoorUtil.times=0;
		 },
		 
		 submitApplyBtn:function(){
			 trapdoorUtil.closeWin();
		 },
		 
		 cancelApplyBtn:function(){
			 trapdoorUtil.closeWin();
		 },
		 
		 checkError:function(){
				var checkTypeString="口令";
				trapdoorVariable.errorTimes+=1;
				if(trapdoorVariable.errorTimes<3){
					PMU.html.utils.alert.show(checkTypeString+"第"+trapdoorVariable.errorTimes+"次错误，请重新输入！", 
							[{   
				            	title:"确定",
				                handler:function(){
				                	document.getElementById("doorPwd").value='';
				                	this.close(); 
				                }
				            }],
							"提示",3);	
				}
				//输错次数等于3
				else{
					//设置定时器，超过3秒，清理缓存
					var errorTimer=setTimeout(function(){			
						//关闭alert弹出框					
						PMU.html.utils.alert.close();
						//$("#centerBar").iPopup("hide");
						trapdoorUtil.closeWin();
						trapdoorVariable.errorTimes=0;
						trapdoorVariable.times=0;
					},3000);
					
					PMU.html.utils.alert.show(checkTypeString+"错误输入3次，自动关闭!", 
							[{   
				            	title:"确定",
				                handler:function(){				                	  
				                	trapdoorVariable.times=0;
				                	trapdoorVariable.errorTimes=0;
				        			//清除定时器
				        			clearTimeout(errorTimer);
				        			errorTimer=null;				        			
				        			trapdoorUtil.closeWin();
				                	this.close();        							                	
				                }
				            }],
							"提示",3);	
				};
		 },
		 
		 createListeningDiv:function(){
				var FirDiv = document.createElement("div");
				FirDiv.id = "FirDiv";
				FirDiv.style.top = "0px";
				FirDiv.style.left = "0px";
				FirDiv.style.position = "absolute";
				FirDiv.style.zIndex = "1000";//设置zIndex为1000,避免被页面pm-header遮挡
				document.body.appendChild(FirDiv); 
				
				var listeningDiv = document.createElement("div");
				listeningDiv.id = "listeningDiv";
				listeningDiv.style.height="100px";
				listeningDiv.style.width="60px";
				listeningDiv.style.background="transparent";
				document.getElementById("FirDiv").appendChild(listeningDiv);
				
				//PMU.html.utils.alert.show("暗门创建成功", null,"提示");	
		 },
		 
		 docEle:function(){
				return document.getElementById(arguments[0]) || false;
		 }	 
};

/*
var docEle = function(){
	return document.getElementById(arguments[0]) || false;
}*/
       
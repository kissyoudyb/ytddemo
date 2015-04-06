//密钥全局变量12345678
//var isInitSecretKey = isInitSecretKey || false;
var isInitSecretKey = true;

function NewMainPage() {
	this.leftMenu1 = $('#leftmenu1');
	this.leftMenu2 = $('#leftmenu2');
	this.leftMenu3 = $('#leftmenu3');
	this.leftMenu1Class = this.leftMenu1.attr('class');
	this.leftMenu2Class = this.leftMenu2.attr('class');
	this.leftMenu3Class = this.leftMenu3.attr('class');
	this.title1 = $('#leftmenu1 a').text();
	this.title2 = $('#leftmenu2 a').text();
	this.title3 = $('#leftmenu3 a').text();
	this.iNow = 0;
	this.loading = new Loading(); // loading效果对象
}

// 初始化方法
NewMainPage.prototype.init = function() {
	
	PMU.Storage.sessionSave("isChecked", true);

	var This = this;

	// 初始化数据
	this.initConfig();
	// 初始化背景图片
	this.initBodyStyle();

	// 平板不显示预约取号菜单
	if ($.session('Orig_Chnl_ID') == '010600') {
		$('#leftmenu1').html('');
		this.dynamic2LevelMenu(JSON.parse(localStorage.getItem('sampleData'))); // 从本地存储中读取菜单
	} else {
		this.dynamic2LevelMenu(JSON.parse(localStorage.getItem('sampleData'))); // 从本地存储中读取菜单
	}

	// 初始化1级菜单
	this.init1LevelMenuOnclick();
	setTimeout(function() {
		This.leftMenu2.mousedown();
	}, 500);

	// 初始化2级菜单
	this.init2LevelMenuOnclick();
	// 初始化返回按钮
	this.initReturnButtonOnclick();
	// 初始化预约取号
	this.initFetchNo();

	/* 密钥初始化-》优化：一次加载完页面后，仅执行一次 只有在填单机上才执行，平板的时候不执行 */
	if (window.isInitSecretKey != true && $.session().Orig_Chnl_ID == '010300') {
		var option = {};
		option.dataType = "text";
		option.data = {
			'jsonData' : JSON.stringify({
				'userId' : window.PMU.comFun.getUserInfo().user_id
			}),
			'_fw_service_id' : 'getUserSecretKeyService'
		};
		option.url = "/ecpweb/ecpJson.action";
		option.success = function(data) {
			data = data.substr(1, data.length - 2);// 去除data中的引号
			var secOption = {};
			var userId = window.PMU.comFun.getUserInfo().user_id;
			secOption.userId = userId;

			PMU.Commu.Device.Sec.secApiInit({
				userID : userId,
				key : data,
				success : function(data) {
					PMU.html.utils.alert.show("密钥初始化成功", null, "提示", 3);
					// PMU.Storage.sessionSave('isInitSecretKey', 'true');
					window.isInitSecretKey = true;
				},
				error : function(data) {
					PMU.html.utils.alert.show("密钥初始化失败，请联系系统管理员", null, "提示", 3);
				}
			});
		};
		option.error = function(data) {
			PMU.html.utils.alert.show("获取密钥失败", null, "提示", 3);
		};
		PMU.Commu.ajax(option);
	}

	/* 密钥初始化 */
};

NewMainPage.prototype.initBodyStyle = function() {
	$('body').css('background', 'url(./imgs/bg1366768.png) no-repeat').width('1366').height('768').css('padding', '0').css('margin', '0');
};

// 动态生成2级菜单
NewMainPage.prototype.dynamic2LevelMenu = function(sampleData) {
	var This = this;
	if (!sampleData) {
		sampleData = sampleData2;
	}

	if ($.session('Orig_Chnl_ID') == '010600') // 如果是平板取sampleData2里的padmenu项，并且采用特殊的菜单显示方式
	{
		sampleData = sampleData2;
		var pMenu21 = sampleData[2].subTree;
		//var pMenu22 = sampleData[3].subTree;
		var eMenu = {};

		// 动态生成平板对私业务菜单，平板菜单只有2级
		This.createPadMenu21(pMenu21, eMenu);
		//This.createPadMenu22(pMenu22, eMenu);
	} else {
		var pMenu = sampleData[0].subTree;
		var eMenu = sampleData[1] ? sampleData[1].subTree : {};
		// 动态生成对私业务菜单
		var ul = $('<ul></ul>');
		for ( var i = 0; i < pMenu.length; i++) {
			//var li = $("<li id='" + pMenu[i].id + "' title='" + pMenu[i].label + "'><a href='javascript:;'><img src='publicProcess/imgs/" + pMenu[i].img + "' width='260' height='130'/></a></li>");
            var li = $("<li id='" + pMenu[i].id + "' title='" + pMenu[i].label + "'><a href='javascript:;'>" + pMenu[i].label + "</a></li>");
			ul.append(li);

			// 添加点击
			li[0].index = i;

			li.mousedown(function() {
				This.dynamic3LevelPMenu(pMenu[this.index].subTree);
			});
		}
		$('.right_menu2_wrap').append(ul);
	}

	// 动态生成对公业务菜单，对公菜单只有2级
	var ul2 = $('<ul></ul>');
	for ( var i = 0; i < eMenu.length; i++) {
		var li = $("<li id='" + eMenu[i].id + "' title='" + eMenu[i].label + "'><a href='javascript:;'><img src='publicProcess/imgs/" + eMenu[i].img + "' width='260' height='130'/></a></li>");
		ul2.append(li);

		// 添加点击
		li[0].index = i;
		li[0].url = eMenu[i].url;
		li[0].padurl = eMenu[i].padurl;
		li[0].beforetip = eMenu[i].beforetip;
		li[0].aftertip = eMenu[i].aftertip;
		li[0].label = eMenu[i].label;
		li[0].busiTypeCode = eMenu[i].busiTypeCode;
		li[0].padtip = eMenu[i].padtip;
		li[0].cqsmBusiType = eMenu[i].cqsmBusiType;

		li.mousedown(function() {

			PMU.Storage.sessionSave('beforetip', this.beforetip);
			PMU.Storage.sessionSave('aftertip', this.aftertip);
			PMU.Storage.sessionSave('label', this.label);
			PMU.Storage.sessionSave('busiTypeCode', this.busiTypeCode);
			PMU.Storage.sessionSave('padtip', this.padtip);
			PMU.Storage.sessionSave('padurl', this.padurl);
			PMU.Storage.sessionSave('cqsmBusiType', this.cqsmBusiType);

			if ($.session().Orig_Chnl_ID == '010300') // 填单机
			{
				// 智慧银行、普通网点分支 banktype 1: 智慧银行 2：普通网点
				var banktype = '1';
				var url = "";
				var cls = PMU.Storage.sessionGet("isChecked", true);
				if (cls == false && PMU.Storage.sessionGet("ecifInfo", true) != null) {
					url = this.padurl;
				} else {
					url = this.url;
				}
				
				if(PMU.Storage.Siteinfo.get().getorder != 1 && this.busiTypeCode == 'xxxxxxxxxx')
				{
					PMU.utils.toURL('../nopreOrderBusi/beforeFetchNo.html');
					return;
				}
				
				if (banktype == '1' && this.beforetip) {
					PMU.utils.toURL(url);
				} else {
					PMU.utils.toURL(url);
				}
			} else // 平板 010600
			{
				if (this.busiTypeCode == 'xxxxxxxxxx') {
					PMU.utils.toURL('../nopreOrderBusi/fetchNo.html');
				} else {
					PMU.utils.toURL(this.padurl);
				}
			}
		});
	}

	$('.right_menu3_wrap').append(ul2);
};


// 重置样式
NewMainPage.prototype.resetClass = function() {
	this.leftMenu1.removeClass().addClass(this.leftMenu1Class);
	this.leftMenu2.removeClass().addClass(this.leftMenu2Class);
	this.leftMenu3.removeClass().addClass(this.leftMenu3Class);
};

// 设置标题
NewMainPage.prototype.setTitle = function(title) {
	$('.right_menu_title p').html(title);
};

// 初始化1级菜单点击事件
NewMainPage.prototype.init1LevelMenuOnclick = function() {
	var This = this;
	this.leftMenu1.mousedown(function() {

		This.iNow = 1;

		This.resetClass();
		This.setTitle(This.title1);

		This.leftMenu1.removeClass().addClass(This.leftMenu2Class);
		This.leftMenu2.removeClass().addClass(This.leftMenu1Class);

		$('#right_submenu_wrap').hide();
		$('#right_menu_wrap').show();

		$('.right_menu2_wrap').animate({
			right : '600'
		}).hide();
		$('.right_menu3_wrap').animate({
			right : '600'
		}).hide();
		$('.right_menu1_wrap').animate({
			right : '0'
		});

		// 当点击预约取号时，清掉菜单标题，避免被打在排队票的业务类型上，排队票优先使用排队机返回的数据
		PMU.Storage.sessionSave('label', '');

		// 智慧银行取预约号,普通网点提示客户去排队机取号 1智慧银行 2普通网点
		var bankType = 1;
		if (bankType == 1) {
			$('.right_menu1_wrap').show();
		} else {
			PMU.Storage.sessionSave('label', '请您取号');
			PMU.Storage.sessionSave('aftertip', '请您前往排队机刷卡取号！');
			PMU.utils.toURL('../nopreOrderBusi/fetchNo.html');
		}
	});

	this.leftMenu2.mousedown(function() {

		This.iNow = 2;

		This.setTitle(This.title2);

		if (This.leftMenu2.attr('class') == This.leftMenu1Class) {
			This.leftMenu1.removeClass().addClass(This.leftMenu1Class);
			This.leftMenu2.removeClass().addClass(This.leftMenu2Class);
		}
		if (This.leftMenu2.attr('class') == This.leftMenu3Class) {
			This.leftMenu3.removeClass().addClass(This.leftMenu3Class);
			This.leftMenu2.removeClass().addClass(This.leftMenu2Class);
		}

		$('#right_submenu_wrap').hide();
		$('#right_menu_wrap').show();

		$('.right_menu1_wrap').animate({
			right : '600'
		}).hide();
		$('.right_menu3_wrap').animate({
			right : '600'
		}).hide();
		$('.right_menu2_wrap').animate({
			right : '0'
		});
		$('.right_menu2_wrap').show();
	});

	this.leftMenu3.mousedown(function() {
		if ($.session().Orig_Chnl_ID == '010600') {
			PMU.html.utils.alert.show("即将推出，敬请期待！", null, "提示", 3);
			return;
		}

		This.iNow = 3;

		This.resetClass();
		This.setTitle(This.title3);
		This.leftMenu3.removeClass().addClass(This.leftMenu2Class);
		This.leftMenu2.removeClass().addClass(This.leftMenu3Class);

		$('#right_submenu_wrap').hide();
		$('#right_menu_wrap').show();

		$('.right_menu1_wrap').animate({
			right : '600'
		}).hide();
		$('.right_menu2_wrap').animate({
			right : '600'
		}).hide();
		$('.right_menu3_wrap').animate({
			right : '0'
		});
		$('.right_menu3_wrap').show();
	});
};

// 二级菜单点击后,隐藏2级菜单，显示3级菜单，更换标题
NewMainPage.prototype.init2LevelMenuOnclick = function() {
	var This = this;
	$('#right_menu_wrap li').mousedown(function() {
		var title = $(this).attr('title');
		This.setTitle(title);
		$(this).parent().parent().hide();
		$('#right_submenu_wrap').show();
		$('#return').show();
	});
};

// 返回按钮点击后，相当于点击了左边某菜单
NewMainPage.prototype.initReturnButtonOnclick = function() {
	var This = this;
	$('#return a').mousedown(function() {

		switch (This.iNow) {
		case 1:
			This.leftMenu1.mousedown();
			break;
		case 2:
			This.leftMenu2.mousedown();
			break;
		case 3:
			This.leftMenu3.mousedown();
			break;
		}
		$('#return').hide();
	});
};

// 动态生成3级对私业务菜单
NewMainPage.prototype.dynamic3LevelPMenu = function(subMenu) {
	// 创建前先清空
	$('#right_submenu_wrap').html('');
	var ul = $('<ul></ul>');
	for ( var i = 0; i < subMenu.length; i++) {
		//var li = $("<li><a href='javascript:;'><img src='publicProcess/imgs/" + subMenu[i].img + "' width='260' height='130'/></a></li>");
        var li = $("<li><a href='javascript:;'>" + subMenu[i].label + "</a></li>");
		ul.append(li);

		// 添加点击
		li[0].index = i;
		li[0].url = subMenu[i].url;
		li[0].padurl = subMenu[i].padurl;
		li[0].beforetip = subMenu[i].beforetip;
		li[0].aftertip = subMenu[i].aftertip;
		li[0].label = subMenu[i].label;
		li[0].busiTypeCode = subMenu[i].busiTypeCode;
		li[0].padtip = subMenu[i].padtip;
		li[0].cqsmBusiType = subMenu[i].cqsmBusiType;

		li.mousedown(function() {
			PMU.Storage.sessionSave('beforetip', this.beforetip);
			PMU.Storage.sessionSave('aftertip', this.aftertip);
			PMU.Storage.sessionSave('label', this.label);
			PMU.Storage.sessionSave('busiTypeCode', this.busiTypeCode);
			PMU.Storage.sessionSave('padtip', this.padtip);
			PMU.Storage.sessionSave('padurl', this.padurl);
			PMU.Storage.sessionSave('cqsmBusiType', this.cqsmBusiType);
			if ($.session().Orig_Chnl_ID == '010300') // 填单机
			{
				// 智慧银行、普通网点分支 banktype 1: 智慧银行 2：普通网点
				var banktype = '1';
				var url = "";
				var cls = PMU.Storage.sessionGet("isChecked", true);
				if (cls == false && PMU.Storage.sessionGet("ecifInfo", true) != null) {
					url = this.padurl;
				} else {
					url = this.url;
				}
				
				if(PMU.Storage.Siteinfo.get().getorder != 1 && this.busiTypeCode == 'xxxxxxxxxx')
				{
					PMU.utils.toURL('../nopreOrderBusi/beforeFetchNo.html');
					return;
				}
				
				if (banktype == '1' && this.beforetip) {
					PMU.utils.toURL(url);
				} else {
					PMU.utils.toURL(url);
				}
				
			} else // 平板 010600
			{
				if (this.busiTypeCode == 'xxxxxxxxxx') {
					PMU.utils.toURL('../nopreOrderBusi/fetchNo.html');
				} else {
					PMU.utils.toURL(this.padurl);
				}
			}
		});
	}
	$('#right_submenu_wrap').append(ul);
};

NewMainPage.prototype.handleValidateCode = function() {

	var reg1 = /(^\d{6}$)|(^\d{10}$)/g;; // 验证码为6位数字 或10位预填单号
	if (reg1.test($('#verif_code').val())) {
		PageManager.loading = new Loading();
		PageManager.loading.show();
		PageManager.printNoCqsm($('#verif_code').val());
		$('#fetchNoBtn').unbind('mousedown');
	} else {
		PMU.html.utils.alert.show('验证码为6位数字或10位预填单号，请重新输入', null, "错误", 3);

	}
	$('#verif_code').val('');
};

// 初始化预约取号
NewMainPage.prototype.initFetchNo = function() {

	$('#fetchNoBtn').bind('mousedown', function() {

		PageManager.handleValidateCode();
	});
};

// 老排队机取号
NewMainPage.prototype.printNoCqsm = function(data) {
	function callback(msg) {
		PMU.utils.toURL('../nopreOrderBusi/fetchNo.html');
	}

	function errorHandler1() {
		PageManager.loading.remove();
		$('#fetchNoBtn').bind('mousedown', function() {
			PageManager.handleValidateCode();
		});
	}

	function errorHandler2() {
		PageManager.loading.remove();
		$('#fetchNoBtn').bind('mousedown', function() {
			PageManager.handleValidateCode();
		});

		// PMU.html.utils.alert.show('网络错误，请求排队机失败，请联系管理员！排队机ip:' +
		// CQSMData.cqsmUrl + ', 机构号:' + CQSMData.orgCode, null, "错误");
		PMU.html.utils.alert.show('网络错误，请求排队机失败，请联系管理员！', null, "错误", 3);
	}

	CQSMData.orgCode = PMU.Storage.Siteinfo.get().orgCode; // 设置排队机机构号
	CQSMData.cqsmUrl = "http://" + PMU.Storage.Siteinfo.get().orderIP + ":8080/cqsm_c/qfic"; // 设置排队机ip地址
	CQSM.cqsmTrans("enqueueReserved_sz_req", {
		"branch_no" : CQSMData.orgCode,
		"verif_code" : data
	}, true, callback, errorHandler1, errorHandler2);
};

/*******************************************************************************
 * 初始化会话数据
 */
NewMainPage.prototype.initConfig = function() {
	/*
	 * Eqmt_ID// 设备编号 Orig_Chnl_ID// 请求渠道：010300 预填单机；010600平板/其他员工移动设备 InsID//
	 * 网点号（机构号） Inst_Ldgr_Hier_Cd// 机构核算层级代码 id 操作员工号 instLevel1BranchId 一级分行号
	 * instLevel2BranchId 二级分行号 name操作员工姓名 ecifCode 已识别客户的ECIF编号
	 * 其中请求渠道、机构号、操作员工号(OPER_CODE)、ECIF编号为必需 获取到以上信息后：
	 * 使用obj.XX方式赋值，接着调用方法PMU.Storage.Manage.saveLightInfo(obj)存储 obj中具体字段为：
	 * exchangePwdToken 暂时不处理 id 操作员工号 instLevel1BranchId 一级分行号
	 * instLevel2BranchId 二级分行号 name 操作员姓名 orgCode 机构号 password positionId
	 */
	var Orig_Chnl_ID = $.getUrlParam("Orig_Chnl_ID");// 请求渠道：010300
	// 预填单机；010600平板/其他员工移动设备
	if (Orig_Chnl_ID == "010600") {
		// 从URL地址中获取系统值（请求渠道、机构号、操作员工号(OPER_CODE)、ECIF编号为必需）
		var Eqmt_ID = $.getUrlParam("Eqmt_ID");// 设备编号
		PMU.Storage.Device.Eqmt_ID = Eqmt_ID;
		var InsID = $.getUrlParam("InsID");// 网点号（机构号）
		var Inst_Ldgr_Hier_Cd = $.getUrlParam("Inst_Ldgr_Hier_Cd");// 机构核算层级代码
		var instLevel1BranchId = $.getUrlParam("instLevel1BranchId");// 一级分行号
		var instLevel2BranchId = $.getUrlParam("instLevel2BranchId");// 二级分行号
		var id = $.getUrlParam("id");// 操作员工号
		var name = $.getUrlParam("name");// 操作员工姓名
		var ecifCode = $.getUrlParam("ecifCode");// 已识别客户的ECIF编号
		var city = $.getUrlParam("city");// 已识别客户的省市区编码

		// 把获取的值重新赋予对象中
		var obj = {};
		obj.exchangePwdToken = null;
		obj.instLevel1BranchId = instLevel1BranchId;
		obj.instLevel2BranchId = instLevel2BranchId;
		obj.id = id;
		obj.name = name;
		obj.orgCode = InsID;
		obj.password = null;
		obj.positionId = null;
		PMU.Storage.Manager.saveLightInfo(obj);

		$.sessionSave({
			ecifCode : ecifCode,// 已识别客户的ECIF编号
			Eqmt_ID : Eqmt_ID,// 设备编号
			Orig_Chnl_ID : Orig_Chnl_ID,// 请求渠道
			InsID : InsID,// 网点号
			city : city,// 省市区编码
			Inst_Ldgr_Hier_Cd : Inst_Ldgr_Hier_Cd,		// 机构核算层级代码
			instLevel1BranchId:instLevel1BranchId,//一级分行号
			instLevel2BranchId:instLevel2BranchId//二级分行号
		});

		$.sessionSave({
			SYS_TX_VRSN : "09"// 服务版本号
		});

		var YTD = $.session();

		var requestData = {};

		requestData.SYS_TX_VRSN = YTD.SYS_TX_VRSN;
		requestData.Orig_Chnl_ID = YTD.Orig_Chnl_ID;
		requestData.Opr_ID = YTD.Opr_ID;
		requestData.InsID = YTD.InsID;
		requestData.Eqmt_ID = YTD.Eqmt_ID;
		requestData.Cst_Id_MtdCd = "4";// 客户识别方式代码
		requestData.ECIFP_Cst_ID = YTD.ecifCode;

		Ajax.query({
			serverid : 'A0161Y002',
			requestData : requestData,
			success : function(str) {
				PMU.Storage.sessionSave('ecifInfo', str);
			},
			fail : function() {
				PMU.html.utils.alert.show("ECIF号为" + YTD.ecifCode + "的客户不存在.", null, "客户不存在", 3);
			}
		});

	} else {
		// 从应用程序中获取系统值
//		PMU.Storage.Device.queryDeviceLoginInfo();
//		var Eqmt_ID = PMU.Storage.Device.getEqmt_ID();
//		var conf = PMU.Storage.Siteinfo.get();
//		$.sessionSave({
//			getorder : conf.getorder,// 1支持取号
//			Eqmt_ID : Eqmt_ID,// 设备编号conf.deviceNum
//			Orig_Chnl_ID : "010300",// 请求渠道conf.apptype
//			InsID : conf.orgCode,// 网点号conf.orgCode
//			Inst_Ldgr_Hier_Cd : "4"// 机构核算层级代码
//		});

		// 测试用
		$.sessionSave({
        getorder : "1", //1支持取号
		Eqmt_ID : "",// 设备编号conf.deviceNum
		Orig_Chnl_ID : "010300",// 请求渠道conf.apptype
		InsID : "350635037",// 网点号conf.orgCode
		Inst_Ldgr_Hier_Cd : "4"// 机构核算层级代码
		});
		$.sessionSave({
			SYS_TX_VRSN : "09"// 服务版本号
		});
	}

};

/**
 * 预先加载图片
 */

NewMainPage.prototype.loadImage = function(url, callback) {
	var img = new Image();
	img.src = url;
	img.onload = function() {
		callback.call(img);
	};
};

NewMainPage.prototype.createPadMenu21 = function(pMenu, eMenu){
	var ul2 = $('<ul></ul>');
	for ( var i = 0; i < pMenu.length; i++) {
		switch (pMenu[i].id) {
		case 'save-pad':
		case 'foreignexchange-pad':
			var li = $("<li class='menu1' id='" + pMenu[i].id + "' title='" + pMenu[i].label + "'><a href='javascript:;'><img src='publicProcess/imgs/" + pMenu[i].img + "' width='510' height='150'/></a></li>");
			break;
		case 'creditcard-pad':
		case 'insurancebusiness-pad':
			var li = $("<li class='menu2' id='" + pMenu[i].id + "' title='" + pMenu[i].label + "'><a href='javascript:;'><img src='publicProcess/imgs/" + pMenu[i].img + "' width='250' height='150'/></a></li>");
			break;
		}
		ul2.append(li);

		// 添加点击
		li[0].index = i;
		li[0].url = pMenu[i].url;
		li[0].padurl = pMenu[i].padurl;
		li[0].beforetip = pMenu[i].beforetip;
		li[0].aftertip = pMenu[i].aftertip;
		li[0].label = pMenu[i].label;
		li[0].busiTypeCode = pMenu[i].busiTypeCode;
		li[0].padtip = pMenu[i].padtip;
		li[0].cqsmBusiType = pMenu[i].cqsmBusiType;

		li.mousedown(function() {
			PMU.Storage.sessionSave('beforetip', this.beforetip);
			PMU.Storage.sessionSave('aftertip', this.aftertip);
			PMU.Storage.sessionSave('label', this.label);
			PMU.Storage.sessionSave('busiTypeCode', this.busiTypeCode);
			PMU.Storage.sessionSave('padtip', this.padtip);
			PMU.Storage.sessionSave('padurl', this.padurl);
			PMU.Storage.sessionSave('cqsmBusiType', this.cqsmBusiType);

			if ($.session().Orig_Chnl_ID == '010300') // 填单机
			{
				// 智慧银行、普通网点分支 banktype 1: 智慧银行 2：普通网点
				var banktype = '1';
				var url = "";
				var cls = PMU.Storage.sessionGet("isChecked", true);
				if (cls == false && PMU.Storage.sessionGet("ecifInfo", true) != null) {
					url = this.padurl;
				} else {
					url = this.url;
				}
				if (banktype == '1' && this.beforetip) {
					PMU.utils.toURL(url);
				} else {
					PMU.utils.toURL(url);
				}
			} else // 平板 010600
			{
				if (this.busiTypeCode == 'xxxxxxxxxx') {
					PMU.utils.toURL('../nopreOrderBusi/fetchNo.html');
				} else {
					PMU.utils.toURL(this.padurl);
				}
			}
		});
	}

	$('.right_menu4_wrap').append(ul2);
	$('.right_menu4_wrap').show();
};

NewMainPage.prototype.createPadMenu22 = function(pMenu, eMenu){
	var ul2 = $('<ul></ul>');
	for ( var i = 0; i < pMenu.length; i++) {
		
		var li = $("<li id='" + pMenu[i].id + "' title='" + pMenu[i].label + "'><a href='javascript:;'><img src='publicProcess/imgs/" + pMenu[i].img + "' width='250' height='150'/></a></li>");
		ul2.append(li);

		// 添加点击
		li[0].index = i;
		li[0].url = pMenu[i].url;
		li[0].padurl = pMenu[i].padurl;
		li[0].beforetip = pMenu[i].beforetip;
		li[0].aftertip = pMenu[i].aftertip;
		li[0].label = pMenu[i].label;
		li[0].busiTypeCode = pMenu[i].busiTypeCode;
		li[0].padtip = pMenu[i].padtip;
		li[0].cqsmBusiType = pMenu[i].cqsmBusiType;

		li.mousedown(function() {
			PMU.Storage.sessionSave('beforetip', this.beforetip);
			PMU.Storage.sessionSave('aftertip', this.aftertip);
			PMU.Storage.sessionSave('label', this.label);
			PMU.Storage.sessionSave('busiTypeCode', this.busiTypeCode);
			PMU.Storage.sessionSave('padtip', this.padtip);
			PMU.Storage.sessionSave('padurl', this.padurl);
			PMU.Storage.sessionSave('cqsmBusiType', this.cqsmBusiType);

			if ($.session().Orig_Chnl_ID == '010300') // 填单机
			{
				// 智慧银行、普通网点分支 banktype 1: 智慧银行 2：普通网点
				var banktype = '1';
				var url = "";
				var cls = PMU.Storage.sessionGet("isChecked", true);
				if (cls == false && PMU.Storage.sessionGet("ecifInfo", true) != null) {
					url = this.padurl;
				} else {
					url = this.url;
				}
				if (banktype == '1' && this.beforetip) {
					PMU.utils.toURL(url);
				} else {
					PMU.utils.toURL(url);
				}
			} else // 平板 010600
			{
				if (this.busiTypeCode == 'xxxxxxxxxx') {
					PMU.utils.toURL('../nopreOrderBusi/fetchNo.html');
				} else {
					PMU.utils.toURL(this.padurl);
				}
			}
		});
	}

	$('.right_menu4_wrap').append(ul2);
	$('.right_menu4_wrap').show();
};

$(function(){
    window.PageManager = new NewMainPage();
    window.PageManager.init();
});
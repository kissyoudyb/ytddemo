/*******************************************************************************
 * 获取渠道名称
 */
$.getChannelName = function(id) {
	var data = [];
	data["010000"] = " 内部渠道";
	data["010100"] = " TOP";
	data["010200"] = " PBCS";
	data["010300"] = " 预填单机";
	data["010400"] = " COST";
	data["010500"] = " 员工渠道";
	data["010600"] = " 平板/其他员工移动设备";
	data["020000"] = " 外部渠道";
	data["020100"] = " 网站";
	data["020200"] = " 网银";
	data["020300"] = " 手机银行";
	data["020500"] = " 微信";
	data["000000"] = " 其他";
	return data[id];
};

/*******************************************************************************
 * 清空不需要的缓存数据
 */
$.sessionClearAll = function(name) {
	$.sessionClear("personalAccount");
	$.sessionClear("foreignCurrencyRemit");
	$.sessionClear("wealthManagementCard");

	PMU.Storage.sessionSave("isChecked", true);// 设置标示：需要验证
	PMU.Storage.sessionSave("ecifInfo", null);// 清除ecif信息
	PMU.Storage.sessionSave("idInfo", null);// 清除身份证验证信息
	PMU.Storage.sessionSave("preBuss", false);
};
/*******************************************************************************
 * 清空
 */
$.sessionClearAllJHL = function(name) {
	$.sessionClear("personalAccount");
	$.sessionClear("foreignCurrencyRemit");
	$.sessionClear("wealthManagementCard");
	$.sessionClear("cashPayment");
	$.sessionClear("receipts");
	$.sessionClear("quickRemit");
};

/*******************************************************************************
 * 解析ECIF数据
 */
$.getECIF = function(ecif) {
	if (ecif == null) {
		return;
	}

	var live_addr = [];// 居住地址201
	var live_addr_all = [];// 居住地址201(包括省市区)
	var live_addr_SN = [];// 居住地址201(序号)

	var work_addr = [];// 单位地址202
	var work_addr_all = [];// 单位地址202(包括省市区)
	var work_addr_SN = [];// 单位地址202(序号)

	var household_addr = [];// 户籍地址203
	var household_addr_all = [];// 户籍地址203(包括省市区)
	var household_addr_SN = [];// 户籍地址203(序号)

	var oth_addr = [];// 其他地址299
	var oth_addr_all = [];// 其他地址299(包括省市区)
	var oth_addr_SN = [];// 其他地址299(序号)

	var live_addr_code = [];// 居住地址201code
	var work_addr_code = [];// 单位地址202code
	var household_addr_code = [];// 户籍地址203code
	var oth_addr_code = [];// 其他地址299code
	var live_addr_post = [];// 居住地址邮政编码
	var work_addr_post = [];// 单位地址邮政编码
	var household_addr_post = [];// 户籍地址邮政编码
	var oth_addr_post = [];// 其他地址邮政编码
	var mobile_phone = [];// 移动电话104
	var work_phone = [];// 办公电话101
	var family_phone = [];// 家庭电话102
	var work_phone_zone = [];// 办公电话区号101
	var family_phone_zone = [];// 家庭电话区号102
	var work_phone_ext = [];// 办公电话分机号101
	var family_phone_ext = [];// 家庭电话分机号102
	var email = [];// 电子邮件地址301

	function checkNoSameAddr(addrs, addrs_all, addr, addr_pre) {
		console.log("---------------------");
		// 检查已解析的地址中有没有与当前地址描述相似的，如果有，则不再次加入地址数组中
		var add = true;
		for ( var i = 0; i < addrs.length; i++) {
			var t_addr = addrs[i];
			var t_addr_all = addrs_all[i];
			console.log("=========当前:===="+t_addr_all);
			console.log("比较详细地址:"+addr+"===="+t_addr);
			// 比较详细地址
			if (t_addr == addr) {
				var index = t_addr_all.indexOf(addr);// 查找详细地址在全量地址中的位置
				if (index != -1) {
					var pre = t_addr_all.substring(0, index);// 获取省市区地址
					console.log("比较省市区:"+pre+"===="+addr_pre);
					if (pre == addr_pre) {
						console.log(addrs_all+"不能加入结合中：失败！");
						// 如果省市区也相同，则不需要显示
						add = false;
						break;
					}
				}
			}

		}
		return add;
	}

	var addr_array = ecif["FMPC1502-CONTACT-Group"];// ECIF中的地址集合
	$(addr_array).each(function() {
		var Ctc_Inf_TpCd = this.Ctc_Inf_TpCd;// 代码
		var Prov_AtnmsRgon_Cd = this.Prov_AtnmsRgon_Cd;// 省自治区代码
		var Urbn_Cd = this.Urbn_Cd;// 城市代码
		var CntyAndDstc_Cd = this.CntyAndDstc_Cd;// 区县代码
		var Dtl_Adr_Cntnt = this.Dtl_Adr_Cntnt;// 详细地址内容
		var ZipECD = this.ZipECD;// 邮政编码
		var TelCtcMod_Dmst_DstcNo = this.TelCtcMod_Dmst_DstcNo;// 电话联系方式号码区号
		var TelCtcMod_No = this.TelCtcMod_No;// 电话联系方式号码
		var TelCtcMod_Exn_No = this.TelCtcMod_Exn_No;// 电话联系方式号码分机号
		var Idv_Ctc_Inf_SN = this.Idv_Ctc_Inf_SN;// 信息序号

		var addr = "";// 只包括局部地址
		var addr_all = "";// 包括省市区详情的地址
		var addr_pre = "";// 包括省市区地址
		var addr_code = "";// 地址代码（包括省市区）

		if ($.isValid(Prov_AtnmsRgon_Cd)) {
			var val = PMU.Service.AreaData.queryName(Prov_AtnmsRgon_Cd);
			addr_all += val;
			addr_pre += val;
		}
		if ($.isValid(Urbn_Cd)) {
			var val = PMU.Service.AreaData.queryName(Urbn_Cd);
			addr_all += val;
			addr_pre += val;
		}
		if ($.isValid(CntyAndDstc_Cd)) {
			var val = PMU.Service.AreaData.queryName(CntyAndDstc_Cd);
			addr_all += val;
			addr_pre += val;
		}

		addr = Dtl_Adr_Cntnt;
		addr_all += addr;
		addr_code = Prov_AtnmsRgon_Cd + "-" + Urbn_Cd + "-" + CntyAndDstc_Cd;// 组合后的地址
		// 居住地址201
		if (Ctc_Inf_TpCd == "201") {
			if (checkNoSameAddr(live_addr, live_addr_all, addr, addr_pre)) {
				live_addr[live_addr.length] = addr;
				live_addr_all[live_addr_all.length] = addr_all;
				live_addr_code[live_addr_code.length] = addr_code;
				live_addr_post[live_addr_post.length] = ZipECD;
				live_addr_SN[live_addr_SN.length] = Idv_Ctc_Inf_SN;
			}
		}
		// 单位地址202
		else if (Ctc_Inf_TpCd == "202") {
			if (checkNoSameAddr(work_addr, work_addr_all, addr, addr_pre)) {
				work_addr[work_addr.length] = addr;
				work_addr_all[work_addr_all.length] = addr_all;
				work_addr_code[work_addr_code.length] = addr_code;
				work_addr_post[work_addr_post.length] = ZipECD;
				work_addr_SN[work_addr_SN.length] = Idv_Ctc_Inf_SN;
			}
		}
		// 户籍地址203
		else if (Ctc_Inf_TpCd == "203") {
			if (checkNoSameAddr(household_addr, household_addr_all, addr, addr_pre)) {
				household_addr[household_addr.length] = addr;
				household_addr_all[household_addr_all.length] = addr_all;
				household_addr_code[household_addr_code.length] = addr_code;
				household_addr_post[household_addr_post.length] = ZipECD;
				household_addr_SN[household_addr_SN.length] = Idv_Ctc_Inf_SN;
			}
		}
		// 其他地址299
		else if (Ctc_Inf_TpCd == "299") {
			if (checkNoSameAddr(oth_addr, oth_addr_all, addr, addr_pre)) {
				oth_addr[oth_addr.length] = addr;
				oth_addr_all[oth_addr_all.length] = addr_all;
				oth_addr_code[oth_addr_code.length] = addr_code;
				oth_addr_post[oth_addr_post.length] = ZipECD;
				oth_addr_SN[oth_addr_SN.length] = Idv_Ctc_Inf_SN;
			}
		}

		var work_phone_zone = [];// 办公电话区号101
		var family_phone_zone = [];// 家庭电话区号102
		var work_phone_ext = [];// 办公电话分机号101
		var family_phone_ext = [];// 家庭电话分机号102

		// 移动电话104
		if (Ctc_Inf_TpCd == "104" && TelCtcMod_No != "") {
			mobile_phone[mobile_phone.length] = TelCtcMod_No;
		}
		// 办公电话101
		if (Ctc_Inf_TpCd == "101" && TelCtcMod_No != "") {
			work_phone[work_phone.length] = TelCtcMod_No;
			work_phone_zone[work_phone_zone.length] = TelCtcMod_Dmst_DstcNo;
			work_phone_ext[work_phone_ext.length] = TelCtcMod_Exn_No;
		}
		// 家庭电话102
		if (Ctc_Inf_TpCd == "102" && TelCtcMod_No != "") {
			family_phone[family_phone.length] = TelCtcMod_No;
			family_phone_zone[family_phone_zone.length] = TelCtcMod_Dmst_DstcNo;
			family_phone_ext[family_phone_ext.length] = TelCtcMod_Exn_No;
		}

	});
	var obj = {
		live_addr : live_addr,// 居住地址201
		live_addr_all : live_addr_all,// 居住地址201
		live_addr_SN : live_addr_SN,// 居住地址201(序列)
		work_addr : work_addr,// 单位地址202
		work_addr_all : work_addr_all,// 单位地址202
		work_addr_SN : work_addr_SN,// 单位地址202(序列)
		household_addr : household_addr,// 户籍地址203
		household_addr_all : household_addr_all,// 户籍地址203
		household_addr_SN : household_addr_SN,// 户籍地址203(序列)
		oth_addr : oth_addr,// 其他地址299
		oth_addr_all : oth_addr_all,// 其他地址299
		oth_addr_SN : oth_addr_SN,// 其他地址299(序列)
		live_addr_code : live_addr_code,// 居住地址201code
		work_addr_code : work_addr_code,// 单位地址202code
		household_addr_code : household_addr_code,// 户籍地址203code
		oth_addr_code : oth_addr_code,// 其他地址299code
		live_addr_post : live_addr_post,// 居住地址邮政编码
		work_addr_post : work_addr_post,// 单位地址邮政编码
		household_addr_post : household_addr_post,// 户籍地址邮政编码
		oth_addr_post : oth_addr_post,// 其他地址邮政编码
		mobile_phone : mobile_phone,// 移动电话104
		work_phone : work_phone,// 办公电话101
		family_phone : family_phone,// 家庭电话102
		email : email,// 电子邮件地址301
		work_phone_zone : work_phone_zone,// 办公电话区号101
		family_phone_zone : family_phone_zone,// 家庭电话区号102
		work_phone_ext : work_phone_ext,// 办公电话分机号101
		family_phone_ext : family_phone_ext,// 家庭电话分机号102
	};
	console.log('读取ECIF信息后返回的数据:' + JSON.stringify(obj));
	return obj;
};
/*******************************************************************************
 * 正则•
 */
$.REG = {
	cn_name : /^([\u4e00-\u9fa5]{1,8}(•[\u4e00-\u9fa5]{1,8}){0,3})$/,
	en_name : /^([a-zA-Z]{1,20}([•,\s][a-zA-Z]{1,20}){0,3})$/,
	cn_en_name : /^([\u4e00-\u9fa5]{1,8}(•[\u4e00-\u9fa5]{1,8}){0,3}|[a-zA-Z]{1,20}([•,\s][a-zA-Z]{1,20}){0,3})$/,
	en_name_agent : /^([a-zA-Z0-9\s]{2,40})$/,
	en_addr : /^([a-zA-Z0-9-#.,()\s@]{2,100})$/,
	cn_addr : /^([\u4e00-\u9fa5-#.。、,\s@()a-zA-Z0-9]{2,100})$/,
	ICCard : /^([a-zA-Z0-9\s]{2,40})$/,
	IDCard : /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
	swift : /^([A-Z0-9]{0,100})$/,
	money : /^([0-9]{1,100}(.[0-9]{1,2}){0,1})$/,
	remark : /^([a-zA-Z0-9-#.,\s@()]{2,100})$/,
	tel : /^[0-9]{7,20}$/,
	mbl_tel : /^[1][0-9]{10}$/,
	w : /^\w{2,20}$/,
	post : /^[0-9]{6}$/,
	validChar : /^([\u4e00-\u9fa5-#.。,:\s@()a-zA-Z0-9]{2,35})$/,
	detail_addr : /^([\u4e00-\u9fa5-#.。)(）（——\/、,\s@()a-zA-Z0-9]{2,100})$/,
	Rmt_Pstcrpt : /^([a-zA-Z0-9-#.,\s@()]{0,100})$/,
	email : /^([a-zA-Z0-9-_]{1,20}(@[a-zA-Z0-9-_.]{1,20}))$/,
	num : /^([0-9]{3,4})$/,

	cn_name_mes : "汉族名限1-8个汉字，少数名族和英译名限1-35个汉字和•符号。",
	en_name_mes : "英文名限1-20个字母，全称限制1-85个字母和•符号。",
	cn_en_name_mes : "汉族名限1-8个汉字，少数名族和英译名限1-35个汉字和•符号或英文名限1-20个字母，全称限制1-85个字母和•符号。",
	en_name_agent_mes : "允许输入英文、空格。限输2-40位字符。",
	en_addr_mes : "允许输入英文、数字、空格、字符@-#.)(，限输2-100位字符。",
	cn_addr_mes : "允许输入中文、英文、数字、空格、字符@-#.)(、，限输2-100位字符。",
	ICCard_mes : "允许输入英文、数字、空格。限输2-40位字符。",
	IDCard_mes : "允许输入英文、数字。必输18位字符。",
	swift_mes : "允许输入大写字母、数字。限输0-100位字符。",
	money_mes : "允许输入数字。限输1-100位字符。",
	remark_mes : "允许输入英文、数字、空格、字符@-#.)(，限输2-100位字符。",
	tel_mes : "允许输入数字。限输8-20位字符。",
	mbl_tel_mes : "允许输入数字。必输11位字符。",
	w_mes : "允许输入字母、数字、字符_。限输2-20位字符。",
	post_mes : "允许输入数字。必输6位数字。",
	validChar_mes : "允许输入中文、英文、数字、空格、字符@-#.:)(，限输2-35位字符。",
	detail_addr_mes : "允许输入中文、英文、数字、空格、字符@-#.)(/——、，限输2-100位字符。",
	Rmt_Pstcrpt_mes : "允许输入英文、数字、空格、字符@-#.)(，限输0-100位字符。",
	email_mes : "请输入正确的电子邮件地址",
	mes : function(mes, params) {
		if (params != null) {
			var len = params.length;
			for ( var i = 0; i < len; i++) {
				mes = mes.replace("{" + i + "}", params[i]);
			}
		}
		return mes;
	}
};

function Ajax() {
}
/*******************************************************************************
 * 请求保存、修改、删除服务
 * 
 * @param param
 */
Ajax.submit = function(param) {

	PMU.html.utils.alert.show("是否确认提交？", [ {
		title : "确定",
		handler : function() {
			// 点击确定按钮后的事件响应
			Ajax.query(param);
			this.close();
		}
	}, {
		title : "取消",
		handler : function() {
			this.close();
		}
	}, ], "提示", 3);

};

/*******************************************************************************
 * 请求查询服务
 * 
 * @param param
 */
Ajax.query = function(param) {
	var loading = new Loading(); // loading效果对象
	loading.show();
	// 点击确定按钮后的事件响应
	var jasonData = JSON.stringify(param.requestData);
	console.log("请求参数:" + jasonData);
	$.padCommu.ecpJson({
		'_fw_service_id' : 'simpleTransaction',
		'transaction_id' : param.serverid,// server id
		jsonData : jasonData,
		success : function(str) {
			loading.remove();
			// 返回正确码
			if (str["BK_STATUS"] == "00") {
				console.log('请求成功，响应码为00, 结果为:' + JSON.stringify(str));
				if (param.success) {
					param.success(str);
				} else {
					PMU.html.utils.alert.show("提交成功！", null, "提示", 3);
				}
			} else {
				console.log('请求成功，响应码不为00, str为：' + JSON.stringify(str));
				if (param.fail) {
					param.fail(str);
				} else {
					// 打印错误信息
					var error_info = str["BK_DESC"];
					var NO = str["_COMMON"]["SYS_EVT_TRACE_ID"];
					PMU.html.utils.alert.show(NO + error_info, null, "错误", 3);
				}

			}
		},
		// 打印出错信息
		error : function(str) {
			loading.remove();
			console.log('请求不成功， str为：' + JSON.stringify(str));
			if (param.error) {
				param.error(str);
			} else {
				// 打印错误信息
				var responseText = str.responseText;
				// 将字串转为JSON对象
				responseText = eval("(" + responseText + ")");
				var error_desc = responseText.BK_DESC;
				var NO = responseText["_COMMON"]["SYS_EVT_TRACE_ID"];
				PMU.html.utils.alert.show(NO + error_desc, null, "错误", 3);
			}

		}
	});
};

/*******************************************************************************
 * 集合
 */
function List() {
	this.array = new Array();
}
List.prototype = {
	/***************************************************************************
	 * 添加元素s
	 * 
	 * @param obj
	 */
	add : function(obj) {
		this.array[this.array.length] = obj;
	},
	/***************************************************************************
	 * 添加数组
	 * 
	 * @param array
	 */
	addAll : function(array) {
		var len = array.length;
		for ( var i = 0; i < len; i++) {
			this.array[this.array.length] = array[i];
		}

	},
	/***************************************************************************
	 * 移除数组
	 * 
	 * @param obj
	 */
	remove : function(obj) {
		var len = this.array.length;
		for ( var i = 0; i < len; i++) {
			var tmp = this.array[i];
			if (tmp === obj) {
				for ( var y = i; y < len; y++) {
					this.array[y] = this.array[y + 1];
				}
				var l = this.array.length;
				this.array[l] = null;
				this.array.length = l - 1;
				break;
			}
		}
	},
	/***************************************************************************
	 * 循环数组
	 * 
	 * @param fn
	 */
	each : function(fn) {
		var len = this.array.length;
		for ( var i = 0; i < len; i++) {
			if (fn.apply(this.array[i], [ i, len, this.array ]) == false) {
				break;
			}
		}
	},
	/***************************************************************************
	 * 循环数组
	 * 
	 * @param fn
	 */
	eachBack : function(fn) {
		var len = this.array.length;
		for ( var i = len - 1; i >= 0; i--) {
			if (fn.apply(this.array[i], [ i, len, this.array ]) == false) {
				break;
			}
		}
	},
	/***************************************************************************
	 * 获取下标元素
	 * 
	 * @param i
	 * @returns
	 */
	get : function(i) {
		return this.array[i];
	},
	/***************************************************************************
	 * 数组大小
	 * 
	 * @returns {Number}
	 */
	size : function() {
		return this.array.length;
	},

};

/*******************************************************************************
 * 集合类
 */
function Map() {
	this.array = {};
}
Map.prototype = {
	// 大小
	length : 0,
	// 添加元素
	put : function(id, obj) {
		this.array[id] = obj;
		this.length++;
	},
	// 移除数组
	remove : function(id) {
		this.array[id] = null;
		this.length--;
	},
	// 循环数组
	each : function(fn) {
		var len = this.length;
		var i = 0;
		for ( var id in this.array) {
			if (this.array[id] != null) {
				if (fn.apply(this.array[id], [ id, this.array[id], i, len, this.array ]) == false) {
					break;
				}
				i++;
			}
		}
	},
	// 获取下标元素(ID索引)
	get : function(id) {
		return this.array[id];
	},
	// 获取下标元素(数字索引)
	getByIndex : function(index) {
		var back = null;
		this.each(function(id, obj, i) {
			if (i == index) {
				back = obj;
				return false;
			}
		});
		return back;
	},
	// 数组大小
	size : function() {
		return this.length;
	}
};

/*******************************************************************************
 * 打印排队号
 */
$.print = function(param) {
	var YTD = $.session();
	// 针对平板渠道的操作
	if (YTD.ecifCode != null) {
		PMU.html.utils.alert.show("是否确定放弃电子填单", [ {
			title : "放弃",
			handler : function() {
				PMU.utils.toURL("../publicProcess/newMainPage.html");
				this.close();
			}
		}, {
			title : "取消",
			handler : function() {
				this.close();
			}
		}, ], "是否确定放弃电子填单？", 3);
		return;
	}

	var fn = function(cardType, cardNo, name, sysLevel) {
		var loading = new Loading(); // loading效果对象
		loading.show();

		CQSMData.orgCode = PMU.Storage.Siteinfo.get().orgCode; // 设置排队机机构号
		CQSMData.cqsmUrl = "http://" + PMU.Storage.Siteinfo.get().orderIP + ":8080/cqsm_c/qfic"; // 设置排队机ip地址

		console.log(cardType + "==" + cardNo + "==" + name + "==" + sysLevel);
		/**
		 * 参数1：请求命名，正常情况下就用如下命令 参数2：传入的json数据，参考接口 参数3：是否打印
		 * 参数4，回调函数，函数参数为排队机请求的响应数据，json对象
		 */
		CQSM.cqsmTrans("submitForm_sz_req", {
			"card_type" : cardType,// 00:身份证,01:银行卡,02:ecif客户号
			"card_no" : cardNo,
			"name" : name,
			"sys_level" : sysLevel,
			"contract_group" : [ "01" ],
			"busi_type" : PMU.Storage.sessionGet("cqsmBusiType")
		}, true, function cqsmfun(data) {
			if (param.success) {
				param.success();
			}
			PMU.utils.toURL("../nopreOrderBusi/fetchNo.html");
		}, function() {
			loading.remove();
			if (param.error) {
				param.error();
			}
			PMU.html.utils.alert.show("排队机返回信息失败", [ {
				"title" : "确定",
				"handler" : function() {
					PMU.utils.toURL("../nopreOrderBusi/idCheck.html");
				}
			} ], "取号失败", 3);
		}, function() {
			loading.remove();
			if (param.error) {
				param.error();
			}
			PMU.html.utils.alert.show('网络错误，请求排队机失败，请联系管理员！排队机ip:' + CQSMData.cqsmUrl + ', 机构号:' + CQSMData.orgCode, [ {
				"title" : "确定",
				"handler" : function() {
					PMU.utils.toURL("../nopreOrderBusi/idCheck.html");
				}
			} ], "网络连接失败", 3);

		});
	};

	if (param.pop == true) {
		PMU.html.utils.alert.show("使用电子填单能够更方便快捷完成填单操作，避免纸质填单时容易发生的书写错误、字迹不清晰等缺点，建议您继续使用电子填单。", [ {
			title : "确定",
			handler : function() {
				this.close();
				if (YTD.getorder == "2") {
					// 不需要取号
					PMU.html.utils.alert.show("您已退出电子填单，请联系大堂经理填写纸质单据，谢谢！", [ {
						title : "确定",
						handler : function() {
							PMU.utils.toURL("../publicProcess/newMainPage.html");
							this.close();
						}
					} ], "退出电子填单", 3);
				} else if (YTD.getorder == "1") {
					PMU.Storage.sessionSave("aftertip", "取号成功，请询问大堂经理填写纸质单据。");
					fn(param.cardType, param.Crdt_No, param.Usr_Nm, param.sysLevel);
				} else {
					PMU.html.utils.alert.show("是否取号功能配置出现错误，必须为1：支持取号、或者2：不支持取号！", null, "错误", 3);
				}
			}
		}, {
			title : "取消",
			handler : function() {
				this.close();
			}
		}, ], "您确定要放弃电子填单吗？", 3);
	} else {
		if (YTD.getorder == "2") {
			// 不需要取号
			PMU.html.utils.alert.show("填单成功，请您前往排队区等候叫号，谢谢！", [ {
				title : "确定",
				handler : function() {
					PMU.utils.toURL("../publicProcess/newMainPage.html");
					this.close();
				}
			} ], "等候叫号", 3);
		} else if (YTD.getorder == "1") {
			fn(param.cardType, param.Crdt_No, param.Usr_Nm, param.sysLevel);
		} else {
			PMU.html.utils.alert.show("是否取号功能配置出现错误，必须为1：支持取号、或者2：不支持取号！", null, "错误", 3);
		}

	}
};
/*******************************************************************************
 * 离开提示
 * 
 * @param param
 */
$.back = function(param) {
	if ($.isNull(param)) {
		param = {};
	}
	if ($.isNull(param.text)) {
		param.text = "你将要离开，数据将会丢失，确定离开？";
	}
	if ($.isNull(param.okText)) {
		param.okText = "确定";
	}
	if ($.isNull(param.noText)) {
		param.noText = "取消";
	}
	var exe = function() {
		$.sessionClearAllJHL();
		if ($.isNotNull(param.url)) {
			PMU.utils.toURL(param.url);
		} else {
			PMU.utils.goBack();
		}
	};

	if (param.pop == false) {
		exe();
		return;
	}

	PMU.html.utils.alert.show(param.text, [ {
		title : param.okText,
		handler : function() {
			exe();
			this.close();
		}
	}, {
		title : param.noText,
		handler : function() {
			this.close();
		}
	} ], "您确定离开？", 3);

};
/*******************************************************************************
 * 首页
 */
$.home = function(param) {
	var exit = function() {
		if (param == null) {
			param = {};
		}

		$.back({
			url : '../publicProcess/newMainPage.html',
			pop : param.pop
		});
	};

	// 如果渠道为平板，则不需要清理session
	if ($.session().ecifCode == null) {
		var preBuss = PMU.Storage.sessionGet("preBuss");// 获取上一次填写的业务单子
		if (preBuss == "true") {
			var ecifInfo = PMU.Storage.sessionGet("ecifInfo", true);
			$.print({
				Crdt_No : ecifInfo.Crdt_No,
				Usr_Nm : ecifInfo.Idv_Lgl_Nm,
				pop : false,
				success : function() {
					$.sessionClearAll();
				}
			});
		} else {
			$.sessionClearAll();
			exit();
		}
	} else {
		exit();
	}

};
$.moneyCostChinese = function(numberValue1) {
	var numberValue = new String(Math.round(numberValue1 * 100)); // 数字金额
	var chineseValue = ""; // 转换后的汉字金额
	var String1 = "零壹贰叁肆伍陆柒捌玖"; // 汉字数字
	var String2 = "万仟佰拾亿仟佰拾万仟佰拾元角分"; // 对应单位
	var len = numberValue.length; // numberValue 的字符串长度
	var Ch1; // 数字的汉语读法
	var Ch2; // 数字位的汉字读法
	var nZero = 0; // 用来计算连续的零值的个数
	var String3 = null; // 指定位置的数值
	if (len > 15) {
		alert("超出计算范围");
		return "";
	}
	if (numberValue == 0) {
		chineseValue = "零元整";
		return chineseValue;
	}
	String2 = String2.substr(String2.length - len, len); // 取出对应位数的STRING2的值
	for ( var i = 0; i < len; i++) {
		String3 = parseInt(numberValue.substr(i, 1), 10); // 取出需转换的某一位的值
		if (i != (len - 3) && i != (len - 7) && i != (len - 11) && i != (len - 15)) {
			if (String3 == 0) {
				Ch1 = "";
				Ch2 = "";
				nZero = nZero + 1;
			} else if (String3 != 0 && nZero != 0) {
				Ch1 = "零" + String1.substr(String3, 1);
				Ch2 = String2.substr(i, 1);
				nZero = 0;
			} else {
				Ch1 = String1.substr(String3, 1);
				Ch2 = String2.substr(i, 1);
				nZero = 0;
			}
		} else { // 该位是万亿，亿，万，元位等关键位
			if (String3 != 0 && nZero != 0) {
				Ch1 = "零" + String1.substr(String3, 1);
				Ch2 = String2.substr(i, 1);
				nZero = 0;
			} else if (String3 != 0 && nZero == 0) {
				Ch1 = String1.substr(String3, 1);
				Ch2 = String2.substr(i, 1);
				nZero = 0;
			} else if (String3 == 0 && nZero >= 3) {
				Ch1 = "";
				Ch2 = "";
				nZero = nZero + 1;
			} else {
				Ch1 = "";
				Ch2 = String2.substr(i, 1);
				nZero = nZero + 1;
			}
			if (i == (len - 11) || i == (len - 3)) { // 如果该位是亿位或元位，则必须写上
				Ch2 = String2.substr(i, 1);
			}
		}
		chineseValue = chineseValue + Ch1 + Ch2;
	}
	if (String3 == 0) { // 最后一位（分）为0时，加上“整”
		chineseValue = chineseValue + "整";
	}
	return chineseValue;
};

/*******************************************************************************
 * 获取指定session
 */
$.session = function(name) {
	var YTD = PMU.Storage.sessionGet("ytd", true);
	if (YTD == null) {
		YTD = {};
	}

	if (name != null && name != "") {
		return YTD[name];
	} else {
		return YTD;
	}
};
/*******************************************************************************
 * 清除指定session
 */
$.sessionClear = function(name) {
	var YTD = PMU.Storage.sessionGet("ytd", true);
	if (YTD == null) {
		YTD = {};
	}

	if (name != null && name != "") {
		YTD[name] = null;
	} else {
		YTD = {};
	}

	PMU.Storage.sessionSave("ytd", YTD);
};
/*******************************************************************************
 * 保存会话数据
 */
$.sessionSave = function(conf, name) {
	var YTD = PMU.Storage.sessionGet("ytd", true);
	if (YTD == null) {
		YTD = {};
	}
	if (name != null && name != "") {
		var obj = YTD[name];
		if (obj == null) {
			obj = {};
		}
		for ( var k in conf) {
			obj[k] = conf[k];
		}
		YTD[name] = obj;
	} else {
		for ( var k in conf) {
			YTD[k] = conf[k];
		}
	}
	PMU.Storage.sessionSave("ytd", YTD);
};

/*******************************************************************************
 * 获取URL地址参数值
 */

$.getUrlParam = function(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg); // 匹配目标参数
	if (r != null)
		return unescape(r[2]);
	return null; // 返回参数值
};

/*******************************************************************************
 * 判断是否为null
 */
$.isNull = function(val) {
	if (val == null || val == undefined) {
		return true;
	} else {
		return false;
	}
};

/*******************************************************************************
 * 判断是否不为null
 */
$.isNotNull = function(val) {
	return !$.isNull(val);
};

/*******************************************************************************
 * 判断是否为有效值（包括等于空字符串）
 */
$.isValid = function(val) {
	if (val != null && val != undefined && val != "")
		return true;
	else
		return false;
};
/*******************************************************************************
 * 判断是否为无效值（包括等于空字符串）
 */
$.isNotValid = function(val) {
	return !$.isValid(val);
};

/*******************************************************************************
 * 获取用户验证信息（Usr_Nm\Crdt_TpCd\Crdt_No\Ctc_Tel\Idv_Nm_CPA_FullNm\ExnoDt\Residence）
 */
$.getValidCus = function() {
	var IdInfo = PMU.Storage.sessionGet('IdInfo', true);// 身份证信息
	var ECIF = PMU.Storage.sessionGet('ecifInfo', true);// 客户ECIF
	var data = {};
	if ($.isNotNull(IdInfo)) {
		// 使用身份证进行
		data.Usr_Nm = IdInfo.Usr_Nm;// 个人法定名称
		data.Crdt_TpCd = "1010";// 证件类型代码
		data.Crdt_No = IdInfo.Crdt_No;// 证件号码
		data.ExnoDt = IdInfo.ExnoDt;// 证件有效期
		data.Residence = IdInfo.Residence;// 居住地
	} else if ($.isNotNull(ECIF)) {
		// 刷身份证验证失败时
		data.Usr_Nm = ECIF.Idv_Lgl_Nm;// 个人法定名称
		data.Usr_Nm_PY = ECIF.Idv_Nm_CPA_FullNm;// 个人法定名称拼音
		data.Crdt_TpCd = ECIF.Crdt_TpCd;// 证件类型代码
		data.Crdt_No = ECIF.Crdt_No;// 证件号码
		data.Ctc_Tel = ECIF.Best_Ctc_Tel;// 最佳联系电话

	}
	console.log('DATA为:' + util.json2str(data));
	return data;
};

/*******************************************************************************
 * 格式时间字符串
 */
$.formate = function(str) {
	var year = str.substring(0, 4);
	var month = str.substring(4, 6);
	var day = str.substring(6, 8);
	return year + "年" + month + "月" + day + "日";
};
/*******************************************************************************
 * 格式化时间
 */
$.formatDate = function(date, format) {
	if (!format) {
		format = "yyyy-MM-dd hh:mm:ss";
	}
	if (!date) {
		date = new Date();
	}
	var o = {
		"M+" : date.getMonth() + 1, // month
		"d+" : date.getDate(), // day
		"h+" : date.getHours(), // hour
		"m+" : date.getMinutes(), // minute
		"s+" : date.getSeconds(), // second
		"q+" : Math.floor((date.getMonth() + 3) / 3), // quarter
		"S" : date.getMilliseconds()
	// millisecond
	};

	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	}

	for ( var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
};
/**
 * 获得目标坐标
 */
$.getPoint = function(target) {

	var point = {
		x : target.offsetLeft,
		y : target.offsetTop
	};

	target = target.offsetParent;
	while (target) {
		point.x += target.offsetLeft;
		point.y += target.offsetTop;
		target = target.offsetParent;
	}
	return point;
};
/*******************************************************************************
 * 获取数字和字母的随机数
 * 
 * @param {}
 *            n
 * @return {}
 */
$.random = function(n) {
	var chars = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];

	var res = "";
	if (!n || n == 0) {
		n = 10;
	}
	for ( var i = 0; i < n; i++) {
		var id = Math.ceil(Math.random() * 35);
		res += chars[id];
	}
	return res;
};
/*******************************************************************************
 * 加载国家数据

$.loadNationData = function(domain) {
	var nationData = $.session(domain).nationData;
	if ($.isNull(nationData)) {
		var options = {
			success : function(nationData) {
				$.sessionSave({
					nationData : nationData
				}, domain);
			},
			categoryid : "119406"
		};
		PMU.Commu.getStandardCode(options);
	}
};
$.loadNationData();
 */

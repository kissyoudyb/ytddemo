var util = {
	autotimer : null,
	/*
	 * json转为str
	 */
	json2str : function(o) {
		if (!o)
			return "";
		var arr = [];
		var fmt = function(s) {
			if (typeof s == 'object' && s != null) {
				return util.json2str(s);
			}
			return /^(string|number)$/.test(typeof s) ? "'" + s + "'" : s;
		};
		if (o.constructor === Array) {
			for ( var i in o) {
				if (typeof o[i] == "string") {
					o[i] = o[i].replace(new RegExp("\\\\", 'gm'), "\\\\");
					o[i] = o[i].replace(new RegExp("\'", "gm"), "\\'");
					o[i] = o[i].replace(new RegExp("\"", "gm"), "\\\"");
					o[i] = o[i].replace(new RegExp("\n", 'gm'), "\\n");// 2013/9/18
					o[i] = o[i].replace(new RegExp("\r", 'gm'), "\\r");
					/*
					 * o[i]=o[i].replace(new RegExp("\n", 'gm'),"\\\n");
					 * o[i]=o[i].replace(new RegExp("\r", 'gm'),"\\\r");
					 */
				}

				arr.push(fmt(o[i]));
			}
			return '[' + arr.join(',') + ']';
		} else {
			for ( var i in o) {
				if (typeof o[i] == "string") {
					o[i] = o[i].replace(new RegExp("\\\\", 'gm'), "\\\\");
					o[i] = o[i].replace(new RegExp("\'", "gm"), "\\'");
					o[i] = o[i].replace(new RegExp("\"", "gm"), "\\\"");
					o[i] = o[i].replace(new RegExp("\n", 'gm'), "\\n");// 2013/9/18
					o[i] = o[i].replace(new RegExp("\r", 'gm'), "\\r");
					/*
					 * o[i]=o[i].replace(new RegExp("\n", 'gm'),"\\\n");
					 * o[i]=o[i].replace(new RegExp("\r", 'gm'),"\\\r");
					 */
				}
				arr.push("'" + i + "':" + fmt(o[i]));
			}
			return '{' + arr.join(',') + '}';
		}
	},

	/*
	 * 获取表单中的数据，封装成json格式
	 */
	getAreaData : function(formId) {
		if (!formId) {
			alert('getAreaData参数错误!formId不能为空!');
		}
		domId = "#" + formId;
		// 处理money,card
		var inputValue = []; // 原始值用于展示信息
		var inValue = []; // 用于保存处理后的值
		// 寻找有无金额和卡号类型
		var inputMoney = $(domId).find("input[datatype='money'],input[datatype='card']");
		for (var i = 0; i < inputMoney.length; i++) {
			// eq(i)获取第i个元素
			var value = inputMoney.eq(i).val();
			inputValue.push(value);
			value = value.replace(new RegExp(",", "gm"), "");
			value = value.replace(new RegExp(" ", "gm"), "");
			inValue.push(value);
			inputMoney.eq(i).val(inValue[i]);
		}
		var o = $(domId).serializeArray(); // 得到值的集合

		/*
		 * 针对Safari浏览器单独处理 修复form内部存在panel子页面form嵌套时出现值无法取到的问题 2013/10/11
		 */
		/*
		 * if($.browser.safari){ var innerForms = $("form",$(domId));
		 * innerForms.each(function (item) {
		 * o=o.concat($(innerForms[item]).serializeArray()); }); }
		 */

		// 还原要展示的值
		for (var i = 0; i < inputMoney.length; i++) {
			inputMoney.eq(i).val(inputValue[i]);
		}
		if (o) {
			var j = {};
			for ( var a in o) {
				if (j[o[a].name]) {
					if (j[o[a].name] instanceof Array)
						j[o[a].name].push(util.trim(o[a].value));
					else {
						var tp = j[o[a].name];
						j[o[a].name] = [];
						j[o[a].name].push(tp);
						j[o[a].name].push(util.trim(o[a].value));
					}
				} else {
					if (!o[a].value)
						o[a].value = "";
					var sValue = util.trim(o[a].value);
					// sValue = escape(sValue);
					sValue = sValue.replace(new RegExp("\r", 'gm'), "\\r");
					sValue = sValue.replace(new RegExp("\n", 'gm'), "\\n");
					j[o[a].name] = sValue;// .replace(new RegExp("\r\n",
					// "gm"), "\\\r\\\n");
				}

			}
			return j;
		}
	},

	/*
	 * 将str去空格
	 */
	trim : function(content) {
		return $.trim(content);
	},

	getDom : function(idOrName) {
		var dom = $('#' + idOrName)[0];
		if (dom)
			return dom;
		return $("[name='" + idOrName + "']")[0];
	},

	/**
	 * 添加string的replaceall方法,str表示需要被replace的字符串，s1为需要被替换的值，s2为替换的值
	 */
	replaceall : function(str, s1, s2) {
		return str.replace(new RegExp(s1, "gm"), s2);
	},

	startWith : function(str, content) {
		var reg = new RegExp("^" + content);
		return reg.test(str);
	},

	/*
	 * 清空form
	 */
	clearForm : function(formId) {
		if (formId) {
			var form = $("#" + formId);
			// form.form('clear');
			clearvalue(form);
			return;
			// 对样式做处理，待修改。
			// 清空红色边框和背景 包括不必填验证
			form.find("li").find("input:not('.pjfcheckbox-input'),select,textarea,span").removeClass(
					"validatebox-tipcolor validatebox-invalid warnbox-tipcolor error-border warn-border");
			// 还原帮助信息，警告信息的图标
			form.find("li").find("span.point_box").removeClass("validatebox-spanicon warnbox-spanicon");
			// 清空所有提示信息元素 add zhangxr
			form.find("li").find("input,select,textarea,span").filter(".invalid_box").addClass("validatebox-invalid");
			// 复选单选外框为
			form.find("li span.validatebox-checkbox").css("border-width", "0px");

			form.find("li").find(".errorbox_ipt_help,.warnbox_ipt_help").remove();

			$(".pjf_quanju").remove();

			// 对select做处理
			form.find('select').each(function() {
				// select处于禁用或只读情况下不做清空值操作
				if ($(this).attr("disabled") == "disabled")
					return;
				for (var a = 0; a < this.options.length; a++) {
					this.options[a].removeAttribute('selected');
				}
				if (this.options[0])
					this.options[0].selected = true;
				// 对重置按钮时文本为空的问题修改只针对组件的下拉框
				$(this).siblings("input.pjf_select").val($(this).find("option:selected").text());
			});
		}

		function clearvalue(formId) {
			$("input,select,textarea", formId).each(function() {
				var t = this.type, tag = this.tagName.toLowerCase();
				// 表单元素处于禁用或只读情况下不做清空值操作
				if ($(this).attr("disabled") == "disabled")
					return;
				if (t == "text" || t == "hidden" || t == "number" || t == "password" || tag == "textarea") {
					this.value = "";
				} else {
					if (t == "file") {
						var _1e = $(this);
						_1e.after(_1e.clone().val(""));
						_1e.remove();
					} else {
						if (t == "checkbox" || t == "radio") {
							this.checked = false;
						} else {
							if (tag == "select") {
								this.selectedIndex = -1;
							}
						}
					}
				}
			});
			// if ($.fn.combo) {
			// $(".combo-f", formId).combo("clear");
			// }
			// if ($.fn.combobox) {
			// $(".combobox-f", formId).combobox("clear");
			// }
			// if ($.fn.combotree) {
			// $(".combotree-f", formId).combotree("clear");
			// }
			// if ($.fn.combogrid) {
			// $(".combogrid-f", formId).combogrid("clear");
			// }
		}
		;
	},

	/*
	 * 将data的数据(json格式)根据form里面元素的ID赋予对应的值，请注意，这里的对应关系是key->id,请确保id的唯一性
	 * prefix是可选属性，如果设置了此值则会根据prefix_key的方式去寻找对应的id，这里的formId是无用的
	 * invalidFlag为true 触发验证 为false 不触发验证
	 */
	setAreaData : function(data, formId, prefix, invalidFlag) {

		if (!data) {
			return;
		}
		var el;
		if (invalidFlag == null) {
			invalidFlag = true; // 默认为true
		}
		for ( var atr in data) {
			if (data[atr]) {
				var domId = atr;
				if (prefix)
					domId = prefix + "_" + atr;
				el = util.getDom(domId);

				if (el) {
					// 对text,textarea,hidden
					if (el.type == 'text' || el.type == 'textarea' || el.type == 'hidden' || el.type == 'number') {
						if (el.type == 'textarea') {
							data[atr] = util.replaceall(data[atr], "\\\\r", "\r");
							data[atr] = util.replaceall(data[atr], "\\\\n", "\n");
						}
						el['value'] = data[atr];
						if (invalidFlag) {
							// 触发验证
							if (el['value'] != '' && $(el).attr("autocomplete") == undefined && el.className != 'datebox-f combo-f'
									&& el.className != 'datebox-f combo-f pjf_disabled_input') {
								// 屏蔽不可用和隐藏时候触发验证 add zhangxr 2013/6/19
								if (el["disabled"] == true || el['display'] == "none")
									continue;
								try {
									// console.log("focus");
									$(el).trigger('focus');
									$(el).trigger('blur');
									$(el).siblings("div.errorbox_ipt_help").remove();// 预防组件没有消除提示信息

								} catch (exception) {
									// do nothing
								}
							}

						}

						// 对日期框做特殊处理
						if (el.className.match(new RegExp('(\\s|^)datebox-f combo-f(\\s|$)')) != null
								|| el.className.match(new RegExp('(\\s|^)combo-f datetimebox-f(\\s|$)')) != null) {
							$(el).next().find('input').each(function() {

								this.value = data[atr];
								if (invalidFlag) {
									// 屏蔽日期不可用时的验证提醒 add zhagnxr
									// 2013/6/19
									if ($(el).next().find('input:first').attr("disabled") == "disabled")
										return;

									$(el).next().find('input:first').trigger('focus');
									$(el).next().find('input:first').trigger('blur');
								}
							});
						}
						// timespinner不带点单独处理
						if (el.className.match(new RegExp('(\\s|^)spinner-text validatebox-text timespinner(\\s|$)')) != null) {
							var value = data[atr];
							var hideValue;
							if ((value.length == 4 || value.length == 6) && !(value.indexOf(":") > 0)) {
								var h = value.substr(0, 2);
								var m = value.substr(2, 2);
								var s = value.substr(4, 2);
								var newValue = "";
								if (s) {
									newValue = h + ":" + m + ":" + s;
								} else {
									newValue = h + ":" + m;
								}
								hideValue = data[atr];
								$(el).parent().find('input').val(newValue);
								$(el).parent().next("input").val(hideValue);
							} else {
								// 带点的时间 给隐藏域赋值 add zhangxr 13/9/27
								hideValue = data[atr].replace(new RegExp(":", 'gm'), "");
								$(el).parent().next("input").val(hideValue);
							}

						}
						// 对timespinnerSpan特殊处理
						if (($(el).prev().children('input').hasClass('spinner-text')) && ($(el).prev().children('input').hasClass('timespinner'))) {
							var showValue = data[atr];
							if ((showValue.length == 4 || showValue.length == 6) && !(showValue.indexOf(":") > 0)) {
								var h = showValue.substr(0, 2);
								var m = showValue.substr(2, 2);
								var s = showValue.substr(4, 2);
								var newValue = "";
								if (s) {
									newValue = h + ":" + m + ":" + s;
								} else {
									newValue = h + ":" + m;
								}
								showValue = newValue;
							}
							var hideValue = data[atr].replace(":", "").replace(":", "").replace(":", "");
							$(el).prev().find('input').val(showValue);
							$(el).val(hideValue);

							$(el).prev().find('input').trigger('focus');
							$(el).prev().find('input').trigger('blur');
						}

						// 对datespan框做特殊处理
						if (util.startWith(el.className, 'combo-text')) {
							$(el).next().next().each(function() {
								this.value = data[atr];
								if (invalidFlag) {
									// 屏蔽日期段不可用时的验证提醒 add zhangxr 2013/6/19
									if ($(el).attr("disabled") == "disabled") {
										return;
									}
									$(el).trigger('focus');
									$(el).trigger('blur');
								}
							});
						}
					}
					// 处理单选框
					else if (el.type == 'select-one') {
						for (var a = 0; a < el.options.length; a++) {
							if (el.options[a].value == data[atr]) {
								el.options[a].selected = true;
								$(el).siblings("input").val($(el.options[a]).text());
								if (data[atr]) {
									// 如果不为空
									$(el).siblings("input").removeAttr("error").removeClass("validatebox-tipcolor error-border").siblings(
											"div.errorbox_ipt_help").remove();
								}
								break;
							}
						}
					}
					// 对radion和checkbox做处理,对checkbox如果是后台是集合则无效
					else if (el.type == 'radio' || el.type == 'checkbox') {
						var tmpName = el.name;
						$('#' + formId + ' input[name=' + tmpName + ']').each(function() {
							if (this.value == data[atr])
								this.checked = true;
						});

					}
					// 如果是容器(div,span)，则对里面相应的元素赋值
					else if (el.type == undefined) {
						// 下拉框
						var sl = $('#' + domId).find('select');
						if (sl.length) {
							sl.each(function() {
								this.value = data[atr];
								$(this).val(data[atr]);
								$(this).siblings("input").val($(this).find('option:selected').text());
								if (this.value) {
									// $(this).siblings("input").removeAttr("error");
									$(this).siblings("input").removeAttr("error").removeClass("validatebox-tipcolor error-border").siblings(
											"div.errorbox_ipt_help").remove();
								}
							});
							continue;
						}
						// 如果是input
						var tx = $('#' + domId).find('input[type="text"],input[type="number"]');
						if (tx.length) {
							tx.each(function() {
								this.value = data[atr];
							});
							continue;
						}

						// radio
						var rd = $('#' + domId).find('input[type="radio"]');
						if (rd.length) {
							rd.each(function() {
								if (this.value == data[atr])
									this.checked = true;
							});
							// radio移除错误信息
							var val = $("#" + domId).find("input:checked").length;
							if (val > 0) {
								$('#' + domId).removeAttr("error").removeClass("validatebox-tipcolor").css("border", "none").siblings("div.errorbox_ipt_help")
										.remove();
							}
							continue;
						}
						// checkbox
						var cb = $('#' + domId).find('input[type="checkbox"]');
						if (cb.length) {
							cb.each(function() {
								this.checked = false;
								if (data[domId] && data[domId] instanceof Array) {
									for ( var a in data[atr]) {
										if (this.value == data[atr][a]) {
											this.checked = true;
										}
									}
								} else {
									if (this.value == data[atr]) {
										this.checked = true;
									}
								}
								// 赋值时移除error信息
								if (this.checked) {
									$('#' + domId).removeAttr("error").removeClass("validatebox-tipcolor").css("border", "none").siblings(
											"div.errorbox_ipt_help").remove();
								}
							});
							continue;
						}
						// 直接对span，div用innerText赋值
						$('#' + domId).empty();
						$('#' + domId).html(data[atr]);

					}

				}
			}
		}

	},

	/* 邮箱自动提示功能 */
	autoCompleteEmail : function(id) {
		/* 获取elt对应控件宽度，设置div宽度等于控件宽度 */
		var elt = $('#' + id);
		var div = id + "_div";
		var width = $('#' + div).width() + "px";

		// var width= $('#'+div).getBoundingClientRect().width+"px";

		var strHtml = "<div class='emailAutoComplete' id='emailAutoComplete' style='width:" + width + "        '>"
				+ "        <ul class='emailAutoComplete_ul'>" + "            <li hz='@qq.com'></li>" + "            <li hz='@163.com'></li>"
				+ "            <li hz='@126.com'></li>" + "            <li hz='@sohu.com'></li>" + "            <li hz='@sina.com'></li>"
				+ "            <li hz='@gmail.com'></li>" + "            <li class='emailAutoComplete_title'>请选择邮箱后缀</li>" + "        </ul>" + "    </div>";
		$('body').append(strHtml);
		var autoComplete, autoLi;
		autoComplete = $('#emailAutoComplete');
		autoComplete.data('elt', elt);
		autoLi = autoComplete.find('li:not(.emailAutoComplete_title)');
		autoLi.mouseover(function() {
			$(this).siblings().filter('.hover').removeClass('hover');
			$(this).addClass('hover');
		}).mouseout(function() {
			$(this).removeClass('hover');
		}).mousedown(function() {
			if (autoComplete.data('elt').val() != '') {
				autoComplete.data('elt').val($(this).text()).change();
				autoComplete.hide();
			}
		});
		// 用户名补全+翻动
		elt.keyup(function(e) {
			if (/13|38|40|116/.test(e.keyCode)) {
				return false;
			}
			if (this.value == '') {
				autoComplete.hide();
				return false;
			}

			var username = this.value;
			if (username.indexOf('@') == -1) {
				// autoComplete.hide();
				// return false;
			}
			// if (username=="" || username==null){
			// autoComplete.hide();
			// }

			var hzNumber = 0;
			autoLi.each(function() {
				this.innerHTML = username.replace(/\@+.*/, '') + $(this).attr('hz');
				if (this.innerHTML.indexOf(username) >= 0) {
					$(this).show();
					hzNumber += 1;
				} else {
					$(this).hide();
				}
			}).filter('.hover').removeClass('hover');

			var topPosition = '';
			if (hzNumber > 2)
				topPosition = this.getBoundingClientRect().top - (25 * hzNumber);
			else {
				if (hzNumber == 1)
					topPosition = this.getBoundingClientRect().top - 45;
				else
					topPosition = this.getBoundingClientRect().top - 65;
			}

			autoComplete.show().css({
				left : $(this).offset().left,
				// top:this.getBoundingClientRect().top-175,//修改邮件位置
				top : topPosition,// 修改邮件位置
				position : 'absolute',
				zIndex : '99999'
			});
			if (autoLi.filter(':visible').length == 0) {
				autoComplete.hide();
			} else {
				autoLi.filter(':visible').eq(0).addClass('hover');
			}
		}).keydown(function(e) {
			if (e.keyCode == 38) { // 上
				autoLi.filter('.hover').prev().not('.AutoComplete_title').addClass('hover').next().removeClass('hover');
			} else if (e.keyCode == 40) { // 下
				autoLi.filter('.hover').next().addClass('hover').prev().removeClass('hover');
			} else if (e.keyCode == 13) { // Enter
				autoLi.filter('.hover').mousedown();
			}
		}).focus(function() {
			autoComplete.data('elt', $(this));
		}).blur(function() {
			autoComplete.hide();
		});
	},

	saveYtdTemplate : function(_fw_service_id, templateName, jsonData) {

		// var isRetrun = util.queryTemplateCount();
		// if (isRetrun[0] == true) {
		util.saveTemplate(_fw_service_id, templateName, jsonData);
		// } else {
		// PMU.html.utils.alert.show(isRetrun[1]);
		// }
	},
	/* 合并对象 */
	apply : function(target, src) {
		if (target && src && typeof src == 'object') {
			for ( var p in src) {
				target[p] = src[p];
			}
		}
		return target;
	},
	/* 获取公共数据 */
	getCommonData : function() {
		var obj = PMU.Storage.sessionGet("ecifInfo", true) || {};
		var jsonObj = {};
		/** 版本号* */
		jsonObj.SYS_TX_VRSN = PMU.Storage.sessionGet('ytd', true) == null ? "" : PMU.Storage.sessionGet('ytd', true).SYS_TX_VRSN;
		/** 请求渠道* */
		jsonObj.Orig_Chnl_ID = PMU.Storage.sessionGet('ytd', true) == null ? "" : PMU.Storage.sessionGet('ytd', true).Orig_Chnl_ID;
		/** 设备编号* */
		jsonObj.Eqmt_ID = PMU.Storage.sessionGet('ytd', true) == null ? "" : PMU.Storage.sessionGet('ytd', true).Eqmt_ID;
		/** 联系电话* */
		jsonObj.Ctc_Tel = obj.Best_Ctc_Tel == undefined || obj.Best_Ctc_Tel == null ? "" : obj.Best_Ctc_Tel;
		/** 手机号码* */
		jsonObj.MblPh_No = obj.MblPh_No == undefined || obj.MblPh_No == null ? "" : obj.MblPh_No;
		/** 电子邮箱地址* */
		jsonObj.Email_Adr = obj.Email_Adr == undefined || obj.Email_Adr == null ? "" : obj.Email_Adr;
		/** 行政区划代码* */
		jsonObj.ADiv_Cd = obj.HshldRgst_ADiv_Cd == undefined || obj.HshldRgst_ADiv_Cd == null ? "" : obj.HshldRgst_ADiv_Cd;
		/** 物理地址信息* */
		jsonObj.Phys_Adr_Inf = obj.Phys_Adr_Inf == undefined || obj.Phys_Adr_Inf == null ? "" : obj.Phys_Adr_Inf;
		/** 邮政编码* */
		jsonObj.ZipECD = obj.ZipECD == undefined || obj.ZipECD == null ? "" : obj.ZipECD;

		return jsonObj;
	},
	queryTemplateCount : function() {
		var isSuccess = [];
		var json = util.getCommonData();

		var jsonObj = {};
		jsonObj.Cst_Id_MtdCd = 1;

		var cvr_id = PMU.Storage.sessionGet("Insuran_Cvr_ID");

		if (cvr_id == "" && $("#Plchd_And_Rcgn_ReTpCd").val() == "0133043") {
			jsonObj.Usr_Nm = $("#Rcgn_Nm").val();
			jsonObj.Crdt_TpCd = "1050";
			jsonObj.Crdt_No = $("#Rcgn_Crdt_No").val();
			jsonObj.AccNo = "";
		} else {
			jsonObj.Usr_Nm = $("#Plchd_Nm").val();
			jsonObj.Crdt_TpCd = $("#Plchd_Crdt_TpCd").val();
			jsonObj.Crdt_No = $("#Plchd_Crdt_No").val();
			jsonObj.AccNo = "";
		}

		util.apply(json, jsonObj);
		$.padCommu.ecpJson({
			'_fw_service_id' : 'simpleTransaction',
			'transaction_id' : 'A0161Y001',
			async : false,
			jsonData : JSON.stringify(json),
			success : function(data) {
				$("body").iLoading('hide');
				if (data["BK_STATUS"] == "00") {
					var limit = parseInt(data.LIMIT);
					var count = parseInt(data.COUNT);
					if (count > limit) {

						isSuccess[isSuccess.length] = false;
						isSuccess[isSuccess.length] = "您的可用模板数已满,无法保存";
					} else {
						isSuccess[isSuccess.length] = true;
					}

				} else {
					isSuccess[isSuccess.length] = false;
					isSuccess[isSuccess.length] = data["BK_DESC"];
				}
			},
			error : function(str) {
				$("body").iLoading('hide');
				var error_desc = str.description;
				isSuccess[isSuccess.length] = false;
				isSuccess[isSuccess.length] = error_desc;
			}
		});
		return isSuccess;
	},
	saveTemplate : function(_fw_service_id, templateName, jsonData) {
		var isSucc = false;
		var date = new Date();
		var yy = date.getFullYear().toString();
		var mm = (date.getMonth() + 1).toString();
		var dd = date.getDate().toString();
		var templateNo = yy + mm + dd;

		var tempName = templateName + "-" + templateNo;

		PMU.html.utils.alert.show("模本名称：<input type='text' value='" + tempName + "' id='tempSaveName' style='width:200px;'>", [ {
			title : "确定",
			handler : function() {
				$("body").iLoading();
				var obj = eval("(" + jsonData + ")");
				obj.RI_Nm = $("#tempSaveName").val();
				$.padCommu.ecpJson({
					'_fw_service_id' : 'simpleTransaction',
					'transaction_id' : _fw_service_id,
					async : false,
					jsonData : JSON.stringify(obj),
					success : function(data) {
						$("body").iLoading('hide');
						var error_info = "";
						if (data["BK_STATUS"] == "00") {
							error_info = "保存成功";
						} else {
							error_info = data["BK_DESC"];
						}

						PMU.html.utils.alert.show(error_info, null, "提示", 3);
						utilJs.myTemplate.create();
					},
					error : function(str) {
						$("body").iLoading('hide');
						var error_desc = str.description;
						PMU.html.utils.alert.show(error_desc, null, "提示", 3);
					}
				});
			}
		}, {
			title : "取消",
			handler : function() {
				this.close();
			}
		} ], "提示", 3);

		return isSucc;
	},
	submit : function(option) {
		var buttons = [ {
			title : "确定",
			handler : function() {
				$("body").iLoading();
				util.submitService(option.service_id, option.data);
			}
		}, {
			title : "取消",
			handler : function() {
				this.close();
			}
		} ];

		PMU.html.utils.alert.show("确认提交?", buttons, "提示", 3);
	},
	submitService : function(serviceId, data, isSubmit) {
		var jsonObj = data;
		$.padCommu
				.ecpJson({
					'_fw_service_id' : 'simpleTransaction',
					'transaction_id' : serviceId,
					jsonData : data,
					type : "post",
					success : function(data) {
						$("body").iLoading('hide');
						if (data.BK_CODE = "000000000000" && data["BK_STATUS"] == "00") {

							var prdflbil_id = data.PrdFlBil_ID;
							var ecifp_cst_id = data.ECIFP_Cst_ID;
							if ($.session().ecifCode == null) {
								var buttons = [  {
									title : "完成",
									handler : function() {
										this.close();
										clearInterval(util.autotimer);
										var obj_ = eval("(" + jsonObj + ")");
										var ECF = PMU.Storage.sessionSave("ecifInfo", true);
										var sysLevel = "";
										if (ECF) {
											sysLevel = ECF.Stm_Evl_Cst_Grd_Cd;
										} else {
											sysLevel = "";
										}
										try {
											$.print({
												cardType : "02",
												sysLevel : sysLevel,
												Crdt_No : ecifp_cst_id,
												Usr_Nm : obj_.Plchd_Nm,
												pop : false
											});
										} catch (e) {

										}
										PMU.Storage.sessionSave("isChecked", true);
										PMU.Storage.sessionRemove("IdInfo");
										PMU.Storage.sessionRemove("ecifInfo");

									}
								} ];
								PMU.html.utils.alert.show("填单完成[填单号:" + prdflbil_id + "],请选择继续填单或完成" + "<br><font id='autoTime'>10</font>秒后无选择,将退出", buttons,
										"成功", 3);
							} else {
								var buttons_ = [  {
									title : "完成",
									handler : function() {
										this.close();
										clearInterval(util.autotimer);
										PMU.Storage.sessionSave("isChecked", true);
										PMU.Storage.sessionRemove("IdInfo");
										PMU.Storage.sessionRemove("ecifInfo");
										PMU.utils.toURL('../publicProcess/newMainPage.html');
									}
								} ];
								PMU.html.utils.alert.show("填单完成[填单号:" + prdflbil_id + "],请选择继续填单或完成" + "<br><font id='autoTime'>10</font>秒后无选择,将退出", buttons_,
										"成功", 3);
							}

							var i = 9;
							util.autotimer = setInterval(function() {
								if (i == 0) {
									clearInterval(util.autotimer);
									$(".alertbox03-mask").remove();
									if ($.session().ecifCode == null) {
										clearInterval(util.autotimer);
										var obj_ = eval("(" + jsonObj + ")");
										var ECF = PMU.Storage.sessionSave("ecifInfo", true);
										var sysLevel = "";
										if (ECF) {
											sysLevel = ECF.Stm_Evl_Cst_Grd_Cd;
										} else {
											sysLevel = "";
										}
										try {
											$.print({
												cardType : "02",
												sysLevel : sysLevel,
												Crdt_No : ecifp_cst_id,
												Usr_Nm : obj_.Plchd_Nm,
												pop : false
											});
										} catch (e) {

										}
										PMU.Storage.sessionSave("isChecked", true);
										PMU.Storage.sessionRemove("IdInfo");
										PMU.Storage.sessionRemove("ecifInfo");
									} else {
										PMU.Storage.sessionSave("isChecked", true);
										PMU.Storage.sessionRemove("IdInfo");
										PMU.Storage.sessionRemove("ecifInfo");
										PMU.utils.toURL('../publicProcess/newMainPage.html');
									}

								} else {
									$("#autoTime").text(i);
									i--;
								}
							}, 1000);

						} else {
							var error_info = data["BK_DESC"];
							PMU.html.utils.alert.show(error_info, null, "提示", 3);
						}
					},
					error : function(json) {
						$("body").iLoading('hide');
						var error_desc = json.description;
						PMU.html.utils.alert.show(error_desc, null, "提示", 3);
					}
				});
	},
	/* 判断是否显示模板保存 */
	isHideTemp : function() {
		var ecifInfo = PMU.Storage.sessionGet("ecifInfo", true);
		if (ecifInfo == null || ecifInfo == undefined) {
			$(".pm-btn-saveTmp").parent().hide();
		} else {
			if (ecifInfo.Cst_ID == null || ecifInfo.Cst_ID == undefined || ecifInfo.Cst_ID == "") {
				$(".pm-btn-saveTmp").parent().hide();
			}
		}
	},
	/* 判断是否显示模板保存 */
	isHideTempNew : function() {
		var ecifInfo = PMU.Storage.sessionGet("ecifInfo", true);
		if (ecifInfo == null || ecifInfo == undefined) {
			$(".pm-btn-templete").hide();
		} else {
			if (ecifInfo.Cst_ID == null || ecifInfo.Cst_ID == undefined || ecifInfo.Cst_ID == "") {
				$(".pm-btn-templete").hide();
			}
		}
	}
};

/*
 * 使用时，$("body").alertbox({ "message": "测试提示信息！" , buttons:[ { title:"确定",
 * handler:function(){ this.close(); } }] });
 * 
 */
$.widget("ui.alertbox", {
	options : {
		message : "hello",
		buttons : [ {
			"title" : "确定",
			"class" : "ok",
			"handler" : function() {
				this.close();
			}
		} ]

	},
	_resize : function() {
		this.mask.width(window.innerWidth);
		this.mask.height(window.innerHeight);
	},
	_init : function() {
		var that = this;
		this.mask = $("<div class='mask'></div>");
		$(this.element).append(this.mask);
		this._resize();
		this.mask.css({
			"position" : "fixed",
			"top" : "0px",
			"background-color" : "rgba(0,0,0,0.5)",
			"z-index" : "10001"
		});
		this.windowBox = $("<div class='windowbox'></div>");
		this.windowBox.height(window.innerHeight * 0.3);
		this.windowBox.width(window.innerWidth);
		this.windowBox.css({
			"position" : "absolute",
			"top" : window.innerHeight * 0.35 + "px",
			"background-color" : "white",
			"z-index" : "10001"// 设置为10001,大于ipopup的10000
		});
		this.mask.append(this.windowBox);
		this.contentBox = $("<div class='windowcontent'></div>");
		this.contentBox.css({
			"position" : "absolute",
			"top" : "50%",
			"right" : "50%",
			"text-align" : "right",
			"width" : "25%",
			"line-height" : "40px",
			"margin-top" : "-20px",
			"background-color" : "white",
			"z-index" : "10001"
		});
		this.windowBox.append(this.contentBox);
		this.contentBox.html($("<span/>").append(this.options.message));
		this.buttonBox = $("<div class='buttons'></div>");
		this.buttonBox.css({
			"position" : "absolute",
			"top" : "50%",
			"left" : "50%",
			"text-align" : "left",
			"line-height" : "40px",
			"margin-left" : "20px",
			"width" : "25%",
			"margin-top" : "-20px",
			"background-color" : "white",
			"z-index" : "10001"
		});
		this.windowBox.append(this.buttonBox);
		var buttons = this.options.buttons;
		for (var i = 0; i < buttons.length; i++) {
			var btn = $("<button class='button'></button>").addClass(buttons[i]["class"]);
			btn.html(buttons[i].title);
			btn.data("hander", buttons[i].handler);
			btn.click(function() {
				var h = $(this).data("hander");
				if ($.isFunction(h)) {
					h.call(that);
				}
			});
			this.buttonBox.append(btn);
		}

	},
	close : function() {
		this.mask.remove();
	}

});

/**
 * 将两个JSON对象组装到一个里面
 * 
 * @param targetJson
 *            目标JSON
 * @param packJson
 *            被组装JSON
 */
function addGroupJson(targetJson, packJson) {
	if (targetJson && packJson) {
		for ( var p in packJson) {
			targetJson[p] = packJson[p];
		}
	}
}
/**
 * 对一个List里面嵌套Group的平铺json数据进行组装
 * 
 * @param jsonData
 *            平铺的Json数据
 * @param key
 *            组装后的键值
 * @param snKey
 *            组装时要自增的分层序号
 */
function dealListGroupJson(jsonData, key, snKey) {
	var result = {};
	var deal = {};
	for ( var p in jsonData) {
		var v = jsonData[p];
		var tmp = p.split(PMC_FIRST_PART_SEP);
		var k = tmp[0];
		var g = tmp[1];
		if (deal[g]) {
			deal[g][k] = v;
		} else {
			deal[g] = {};
			deal[g][k] = v;
			if (snKey) {
				deal[g][snKey] = g;
			}
		}
	}
	var t = [];
	for ( var g in deal) {
		t.push(deal[g]);
	}
	// 返回结果
	result[key] = t;
	return result;
}

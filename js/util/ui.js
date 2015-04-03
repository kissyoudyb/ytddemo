$(window).bind("ajaxpageloaded", function() {
	new UI();
});
/*******************************************************************************
 * 定义一些简单实用的方法或者变量
 */
$.ui = {};
/*******************************************************************************
 * 设置面板中配置的错误信息
 */
$.ui._setErrorHtml = function(param) {
	if (param.block.find(".error").get(param.index) == null) {
		PMU.html.utils.alert.show("请在ID为" + param.block.attr("id") + "业务块中配置class属性为error的DIV层。", null, "未找到错误提示层", 3);
	}
	param.block.find(".error").find(".content").html("提示：&nbsp;&nbsp;" + param.mes);
};
/*******************************************************************************
 * 显示面板中配置的错误信息
 */
$.ui.errorShow = function(param) {
	var index = param.index;
	if (index == null) {
		index = 0;
	}
	$.ui._setErrorHtml(param);
	$(param.block.find(".error").get(index)).show();
};
/*******************************************************************************
 * 隐藏面板中配置的错误信息
 */
$.ui.errorHide = function(param) {
	var index = param.index;
	if (index == null) {
		index = 0;
	}
	param.mes = "";
	$.ui._setErrorHtml(param);
	$(param.block.find(".error").get(index)).hide();
};
/*******************************************************************************
 * 设置页面头显示文本
 */
$.ui.setHeaderTitle = function(text) {
	$(".header-title").html(text);
};
/*******************************************************************************
 * 点击界面触发指定方法
 */
$.ui.bodyListener = function(fn) {
	$(".content-wrap").mouseup(function() {
		fn();
	});
	$(".header").mouseup(function() {
		fn();
	});
};
/*******************************************************************************
 * 集合类
 */
function UIList() {
	this.array = new Array();
}
UIList.prototype = {
	// 大小
	length : 0,
	// 添加元素
	add : function(obj) {
		this.array[obj.id] = obj;
		this.length++;
	},
	// 添加元素,流程专用
	addBlock : function(obj) {
		this.array[obj.id] = obj.config;
		this.length++;
	},
	// 添加数组
	addAll : function(array) {
		var len = array.length;
		for ( var i = 0; i < len; i++) {
			var obj = array[i];
			this.array[obj.id] = obj;
			this.length++;
		}

	},
	// 添加数组,流程专用
	addAllBlock : function(array) {
		var len = array.length;
		for ( var i = 0; i < len; i++) {
			var obj = array[i];
			this.array[obj.id] = obj.config;
			this.length++;
		}

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
			if (fn.apply($("#" + id), [ id, this.array[id], i, len, this.array ]) == false) {
				break;
			}
			i++;
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
 * 控制业务流转的进程类
 */
function Process(param) {
	this.initStart = new Date().getTime();
	this.block = param.block;// 进程单元集合（必须）
	this.preBtn = param.preBtn;// 进程单元如何跳转上一步按钮（必须）
	this.nextBtn = param.nextBtn;// 进程单元如何跳转下一步按钮（必须）
	this.submitBtn = param.submitBtn;// 进程提交按钮,赋予此值得目的是为了在进程最后一步中才显示提交按钮（可选）

	if (param.startBlock != null) {
		this.curBlock = param.startBlock;// 此进程下标，标记进行到第几单元
		this.startBlock = param.startBlock;// 进程开始下标
	} else {
		this.curBlock = this.block.getByIndex(0).id;
		this.startBlock = this.block.getByIndex(0).id;
	}

	this.animate = true;// 默认需要动画
	if (param.animate != null) {
		this.animate = param.animate;
	}

	this.init();
	this.initEnd = new Date().getTime();
	console.log("【信息】流程Process组件初始化完成，用时：" + (this.initEnd - this.initStart) + "mm");
}
Process.prototype = {
	init : function() {
		this.initProcess();
	},
	/***************************************************************************
	 * 初始化业务流程
	 */
	initProcess : function() {
		var PageManager = this;
		this._hideAllCell();
		// ////////////////////////////////////////////////////////////////////////////////////////////////////////
		// 下一页(isCheck:是否验证、isAnimate：是否动画、isAction：是否触发事件、isNavigation：是否导航栏)
		// ////////////////////////////////////////////////////////////////////////////////////////////////////////
		this.next = function(isCheck, isAnimate, isAction, isNavigation) {
			$(this).attr("disabled", true);
			PageManager.preBtn.attr("disabled", true);
			var cur = PageManager.block.get(PageManager.curBlock);// 当前块

			// 验证数据合法性
			if (isCheck) {
				if (!Process.check(cur)) {
					$(this).attr("disabled", false);
					PageManager.preBtn.attr("disabled", false);
					return;
				}
			}

			var nextID = PageManager._getNextID(cur);// 下一块ID(准备开始显示下一块)
			if (nextID == null || nextID == PageManager.curBlock) {
				$(this).attr("disabled", false);
				PageManager.preBtn.attr("disabled", false);
				return;
			}

			var next = PageManager.block.get(nextID);// 下一块
			next.pre = PageManager.curBlock;
			PageManager.curBlock = nextID;

			// 如果当前页有上一页，则显示上一页按钮
			if (typeof (next.pre) == "string") {
				PageManager.preBtn.show();
			}
			// 如果当前页没有下一页，则隐藏下一页按钮
			if (PageManager._getNextID(next) == null) {
				PageManager.nextBtn.hide();
				// 如果指定了进程提交按钮，则需要显示出来
				if (PageManager.submitBtn) {
					PageManager.submitBtn.show();
				}
			} else {
				if (PageManager.submitBtn) {
					PageManager.submitBtn.hide();
				}
			}

			// 显示面板
			var show = function() {
				$("#" + cur.id).hide();
				$("#" + next.id).show();
				$(this).attr("disabled", false);
				PageManager.preBtn.attr("disabled", false);
			};

			// 是否使用动画显示
			if (isAnimate == null || isAnimate) {
				if (PageManager.animate) {
					PageManager._toBlockForAnimate($("#" + cur.id), $("#" + next.id), true, $(this), PageManager.preBtn);// 动画显示
				} else {
					show();
				}
			} else {
				show();
			}

			$(this).attr("disabled", false);
			PageManager.preBtn.attr("disabled", false);

			// 绑定事件
			var event = function(obj, listener, fn, onlyFirstBind) {
				Process.bind(next, obj, listener, fn, onlyFirstBind);
			};

			// 导航栏状态设置
			if (next.conf != null) {
				var navigation = function(process, i, x) {
					if (isNavigation == null || isNavigation) {
						process.set(i, x);
					}
				};
				next.conf.apply(next, [ event, navigation ]);
			}

			// 下一步自定义处理事件
			if ((isAction == null || isAction) && next.action != null) {
				next.action.apply(next, [ event ]);
			}
		};
		// ////////////////////////////////////////////////////////////////////////////////////////////////////////
		// 上一页
		// ////////////////////////////////////////////////////////////////////////////////////////////////////////
		this.pre = function() {
			$(this).attr("disabled", true);
			PageManager.nextBtn.attr("disabled", true);
			var cur = PageManager.block.get(PageManager.curBlock);// 当前块
			var preID = PageManager._getPreID(cur);// 上一块序号

			if (preID == null || preID == PageManager.curBlock) {
				$(this).attr("disabled", false);
				PageManager.nextBtn.attr("disabled", false);
				return;
			}

			var pre = PageManager.block.get(preID);// 上一块
			PageManager.curBlock = preID;

			// 如果当前页有上一页，则显示上一页按钮
			if (typeof (pre.pre) == "string") {
				PageManager.preBtn.show();
			} else {
				PageManager.preBtn.hide();
			}
			// 如果当前页没有下一页，则隐藏下一页按钮
			if (PageManager._getNextID(pre) == null) {
				PageManager.nextBtn.hide();
			} else {
				PageManager.nextBtn.show();
				if (PageManager.submitBtn) {
					PageManager.submitBtn.hide();
				}
			}

			// 显示面板
			if (PageManager.animate) {
				PageManager._toBlockForAnimate($("#" + cur.id), $("#" + pre.id), false, $(this), PageManager.nextBtn);// 动画显示
			} else {
				$("#" + cur.id).hide();
				$("#" + pre.id).show();
			}
			$(this).attr("disabled", false);
			PageManager.nextBtn.attr("disabled", false);

			// 绑定事件
			var event = function(obj, listener, fn, onlyFirstBind) {
				Process.bind(pre, obj, listener, fn, onlyFirstBind);
			};

			// 配置设置
			if (pre.conf != null) {
				var navigation = function(process, i, x) {
					process.set(i, x);
				};
				pre.conf.apply(pre, [ event, navigation ]);
			}

		};

		// 下一步按钮 只允许父类为流程中的单元的时候才加入进程中
		this.nextBtn.each(function() {
			var p = PageManager._getParentInProcess($(this));
			if (p != null) {
				$(this).mousedown(PageManager.next);
			}
		});

		// 上一步按钮 只允许父类为流程中的单元的时候才加入进程中
		this.preBtn.each(function() {
			if (PageManager._getParentInProcess($(this)) != null) {
				$(this).mousedown(PageManager.pre);
			}
		});

		// 提交按钮 只允许父类为流程中的单元的时候才加入进程中
		var submitBtn = [];
		this.submitBtn.each(function() {
			if (PageManager._getParentInProcess($(this)) != null) {
				submitBtn[submitBtn.length] = this;
			}
		});
		this.submitBtn = $(submitBtn);
	},
	/***************************************************************************
	 * 查找所属于进程中的父类(限制查找10层，防止性能变差)【类私有方法】
	 */
	_getParentInProcess : function(obj) {
		var PageManager = this;
		var parent = null;
		var i = 0;
		var get = function(child) {
			i++;
			var p = child.parent();

			if ($.isNotNull(p)) {
				var block = PageManager.block.get(p.attr("id"));
				if ($.isNotNull(block) && $.isNotNull(block.id)) {
					parent = p;
				} else if (i < 10) {
					get(p);
				}
			}
		};
		get(obj);
		return parent;
	},
	/***************************************************************************
	 * 动画形式显示面板【类私有方法】
	 * 
	 * @param hide
	 * @param show
	 * @param flag
	 * @param btn
	 * @param btn2
	 */
	_toBlockForAnimate : function(hide, show, flag, btn, btn2) {

		if (flag) {
			// 下一步操作

			hide.animate({
				left : "-80%"
			}, 600, function() {
				hide.hide();
				hide.css("left", "10%");
			});

			show.css("left", "100%");
			show.show();
			show.animate({
				left : "10%"
			}, 600, function() {
				btn.attr("disabled", false);
				btn2.attr("disabled", false);
			});

		} else {
			// 上一步操作

			hide.animate({
				left : "100%"
			}, 600, function() {
				hide.hide();
				hide.css("left", "10%");
			});

			show.css("left", "-80%");
			show.show();
			show.animate({
				left : "10%"
			}, 600, function() {
				btn.attr("disabled", false);
				btn2.attr("disabled", false);
			});
		}

	},
	/***************************************************************************
	 * 隐藏所有进程中界面元素【类私有方法】
	 */
	_hideAllCell : function() {
		this.block.each(function(id, obj, i, len, array) {
			this.hide();
		});
	},

	/***************************************************************************
	 * 启动进程
	 */
	start : function(jump) {
		this._hideAllCell();
		this.preBtn.hide();
		this.nextBtn.show();
		var nextID = this._getNextID(this.block.get(this.startBlock));
		if (nextID == null) {
			this.nextBtn.hide();
		} else {
			if (this.submitBtn != null) {
				this.submitBtn.hide();
			}
		}

		// 事件
		var event = function(obj, listener, fn, onlyFirstBind) {
			Process.bind(startBlock, obj, listener, fn, onlyFirstBind);
		};

		var startBlock = this.block.get(this.startBlock);// 下一块
		// 导航栏状态设置
		if (startBlock.conf != null) {
			var navigation = function(process, i, x) {
				process.set(i, x);
			};
			startBlock.conf.apply(startBlock, [ event, navigation ]);
		}
		// 下一步自定义处理事件
		if (jump == null && startBlock.action != null) {
			startBlock.action.apply(startBlock, [ event ]);
		}
		$("#" + this.startBlock).show();

		this.curBlock = this.startBlock;
	},
	/***************************************************************************
	 * 允许跳转到指定下标单元，跳转过程将不会触发验证check和活动action方法
	 * 
	 * @param index
	 */
	to : function(id) {
		if (id == null) {
			return;
		}
		var PageManager = this;
		this.start(true);
		this.preBtn.show();
		this.nextBtn.show();
		var i = 0;
		var _to = function(curid) {
			var cur = PageManager.block.get(curid);
			var nextID = PageManager._getNextID(cur);// 下一块序号
			var next = PageManager.block.get(nextID);// 下一块

			if (nextID != id && i < PageManager.block.length) {
				PageManager.next(false, false, false, false);
				_to(nextID);
			}
			if (nextID == id) {
				PageManager.next(false, false, false, true);
			}
			i++;
		};
		try {
			_to(this.startBlock);
		} catch (e) {
			if (id == this.startBlock) {
				this.start(true);
			}
		}
	},
	/***************************************************************************
	 * 进程验证
	 */
	check : function(flag) {
		var PageManager = this;
		var index = 0;
		if (flag == null) {
			flag = true;
		}
		var check_ = function(id) {

			var cur = PageManager.block.get(id);
			// 验证数据合法性
			if (!Process.check(cur)) {
				if (flag) {
					PageManager.to(id);// 跳转到错误单元
				}
				index++;
			} else {
				var nextID = PageManager._getNextID(cur);// 下一块序号
				if (nextID != null) {
					check_(nextID);
				}
			}
		};

		check_(this.startBlock);

		if (index == 0) {
			return true;
		} else {
			return false;
		}

	},
	/***************************************************************************
	 * 获取下一块的ID【类私有方法】
	 * 
	 * @param obj
	 * @returns
	 */
	_getNextID : function(obj) {
		var nextID = null;// 下一块ID
		if (typeof (obj.next) == "function") {
			nextID = obj.next();
		} else if (typeof (obj.next) == "string") {
			nextID = obj.next;
		}
		if (typeof (nextID) != "string") {
			nextID = null;
		}

		return nextID;
	},
	/***************************************************************************
	 * 获取上一块的ID【类私有方法】
	 * 
	 * @param obj
	 * @returns
	 */
	_getPreID : function(obj) {

		var preID = null;// 上一块序号
		if (typeof (obj.pre) == "string") {
			preID = obj.pre;
		}

		if (typeof (preID) != "string") {
			preID = null;
		}

		return preID;
	}

};

/*******************************************************************************
 * 绑定事件【类方法】
 */
Process.bind = function(cur, el, listener, fn, onlyFirstBind) {
	if (listener == null) {
		listener = "blur";
	}

	if (fn == null) {
		fn = function() {
			Process.check(cur);
		};
	}
	if (onlyFirstBind == null || onlyFirstBind) {
		el.unbind(listener).bind(listener, fn);
	} else {
		el.bind(listener, fn);
	}
};
/*******************************************************************************
 * 验证每个进程单元数据合法性【类方法】
 * 
 * @param cur
 * @returns {Boolean}
 */
Process.check = function(cur) {
	// return true;
	// 验证数据合法性
	if (typeof (cur.check) == "function") {
		var $cur = $("#" + cur.id);// 当前块
		var $detailError = $cur.find(".detail-error");// 当前块的错误提示列表
		var $error = $cur.find(".error");// 当前块的错误提示项
		// 检验员
		var checker = {
			_detail : $detailError,
			_error : $error,
			_get : function(errArray, index) {
				var errObj = null;
				var size = errArray.size();
				if (index != null) {
					if (index >= size) {
						PMU.html.utils.alert.show("class值为.error的元素发生错误：下标越界", null, "错误", 3);
						return;
					}
					var i = 0;
					errArray.each(function() {
						if (i == index) {
							errObj = $(this);
							return false;
						}
						i++;
					});

				} else {
					errObj = errArray;
				}
				return errObj;
			},
			check : function(param) {
				var objArray = null;
				if (param.objArray != null) {
					objArray = param.objArray;
				} else {
					objArray = this._error;
				}
				var errObj = this._get(objArray, param.index);

				var fn = function() {
					if (param.fn()) {
						errObj.hide();
						return true;
					} else {
						errObj.show();
						var errorMes = "提示：&nbsp;&nbsp;" + param.mes;
						if (errObj.find(".content").get(0) != null) {
							errObj.find(".content").html(errorMes);
						} else {
							errObj.html(errorMes);
						}
						return false;
					}
				};
				return fn();
			},
			detailCheck : function(param) {
				param.objArray = this._detail;
				return this.check(param);
			}
		};

		if (!cur.check.apply($cur, [ cur, checker ])) {
			return false;
		} else {
			// 清除错误提示（如果界面配置了此元素，则会起效果）
			$detailError.hide();
			$detailError.html("");
			$error.hide();
			$error.find(".content").html("");
			return true;
		}
	} else {
		// 如果不是方法，则默认通过验证
		return true;
	}
};

/*******************************************************************************
 * 当界面HTML元素初始化完成后，开始加载自定义组件
 */
function UI() {
	this.init();
}
UI.prototype = {
	init : function() {
		this.initStart = new Date().getTime();
		this.initPage();
		this.initEnd = new Date().getTime();
		console.log("【信息】UI加载界面元素完成，用时：" + (this.initEnd - this.initStart) + "mm");
	},
	initPage : function() {
		this.textbox();// 加载文本框、文本域相关组件配置
		this.errorTip();// 加载错误提示层组件配置
		this.pop();// 加载弹出层组件配置
	},
	/***************************************************************************
	 * 文本框相关配置
	 */
	textbox : function() {
		// 加载文本框CSS配置
		$(".textbox,.checkBox,.radioBox").each(function() {
			var itme = $(this);
			var input = itme.find("input,textarea");// 文本框

			// 清空按钮赋予功能
			var btn = itme.find(".clear");
			btn.mousedown(function() {
				input.val("");
				input.focus();
			});

			// 给输入框赋予提示层
			var $tooltip = $(this).find(".tooltip");
			if ($.isNotNull($tooltip[0])) {
				new Tooltip({
					render : $tooltip,
					el : input
				});
			}

			// 给数字输入框赋予数字键盘
			var $numkey = $(this).find(".num-Keyboard");
			if ($.isNotNull($numkey[0])) {
				var mode = $numkey.attr("mode");
				if (mode == null) {
					mode = "num";
				}
				var maxLength = $numkey.attr("maxLength");
				if (maxLength == null) {
					maxLength = "10000";
				}
				new NumKeyboard({
					render : $numkey,
					el : input,
					mode : mode,
					maxLength : maxLength
				});
			}
			// 给输入框赋予键盘
			var $keyboard = $(this).find(".keyboard");
			if ($.isNotNull($keyboard[0])) {
				var mode = $keyboard.attr("mode");
				if (mode == null) {
					mode = "lowercase";
				}
				var maxLength = $keyboard.attr("maxLength");

				var format = $keyboard.attr("format");
				var tip = $keyboard.attr("tip");

				var disabledSign = $keyboard.attr("disabledSign");
				if (disabledSign == "true") {
					disabledSign = true;
				}
				if (disabledSign == null || disabledSign == "false") {
					disabledSign = false;
				}
				new Keyboard({
					render : $keyboard,
					el : input,
					mode : mode,
					disabledSign : disabledSign,
					format : format,
					maxLength : maxLength,
					tip : tip
				});
			}

			// 给输入框赋予交易编码
			var $transcode = $(this).find(".transcode");
			if ($.isNotNull($transcode[0])) {
				new TransCodeBar({
					render : $transcode,
					el : input
				});
			}
		});
	},
	/***************************************************************************
	 * 错误提示层
	 */
	errorTip : function() {
		var content = $("<div class='content'></div>");
		var s = $("<s></s>");
		var i = $("<i></i>");
		s.append(i);
		$(".error").append(content).append(s);
		$(".error").mouseup(function() {
			$(this).hide();
		});
	},
	/***************************************************************************
	 * 弹出层关闭按钮
	 */
	pop : function() {
		$(".pop-bg").each(function() {
			var itme = $(this);
			var close = itme.find(".pop-close");
			close.mousedown(function() {
				itme.hide();
			});
		});
	}
};

/*******************************************************************************
 * 提示层
 */
function Tooltip(param) {
	this.render = param.render;
	this.el = param.el;
	this.init();
}

Tooltip.prototype = {
	init : function() {
		var text = this.render.html();
		this.render.empty();
		var content = $("<div class='content'></div>");
		var s = $("<s></s>");
		var i = $("<i></i>");
		s.append(i);
		this.render.append(content).append(s);
		content.html(text);
	}
};
/*******************************************************************************
 * 导航条
 */
function Navigation(param) {
	this.render = param.render;
	this.data = param.data;
	this.process = param.process;
	this.init();
}

Navigation.prototype = {
	init : function() {
		var thiz = this;
		this.render.empty();

		this.data.add({
			to : "submit",
			html : "确认提交"
		});

		this.ps = [];
		this.ps_text = [];
		this.ss = [];
		this.els = [];
		this.tos = [];
		var left = 0;// 先计算偏移量
		var point = [];
		var width = 150;
		this.data.each(function(index, i) {
			var len = (this.html.length - 4) * 30;
			left = left + len + width;
			point[point.length] = left;

		});
		this.data.eachBack(function(index) {
			var navigation = $("<div class='navigation'>");
			var content = $("<div class='content' index=" + index + "></div>");
			var p = $("<div class='process'></div>");
			var p_text = $("<div class='process-text' val='0'></div>");
			var label = $("<label></label>");
			var input = $("<input type='radio' name='navigation' id='navigation" + index + "'>");
			var s = $("<div class='s'></div>");

			navigation.append(label);
			thiz.render.append(navigation);

			var _this = this;

			content.html(this.html);
			content.mouseup(function() {
				thiz.process.to(thiz.tos[$(this).attr("index")]);
			});

			label.append(input);
			label.append(content);
			label.append(p);
			label.append(p_text);
			label.append(s);
			var len = (this.html.length - 4) * 30;
			navigation.css("left", (point[index] - width - len) + "px");
			navigation.css("width", (width + len - 10) + "px");
			content.css("width", (width + len) + "px");

			thiz.els[index] = input;
			thiz.tos[index] = _this.to;
			thiz.ps[index] = p;
			thiz.ps_text[index] = p_text;
			thiz.ss[index] = s;
		});

	},
	set : function(i, b) {
		var thiz = this;
		if (i != null) {
			this.els[i].prop("checked", true);
			if (b != null) {
				this.ps[i].animate({
					width : b + "%"
				}, 600);

				this.ps_text[i].animate({
					val : b
				}, {
					speed : 600,
					step : function(e) {
						var v = parseInt(e);
						$(this).html(v + "%");
						$(this).css("left", parseInt(thiz.ps[i].css("width")) + "px");
					}
				});
			}
		}
	},
	end : function() {

	}
};
/*******************************************************************************
 * 键盘
 */
function Keyboard(param) {
	this.render = param.render;
	this.el = param.el;
	this.mode = param.mode;// 键盘提供的显示模式： lowercase、capital、sign、num
	this.charState = "small";// 英文字母大小写状态：small、big
	this.signState = "checked";// 符号切换状态： unchecked、checked
	this.cursor = 0;// 光标位置记录
	this.disabledSign = false;// 是否提供符号选择功能
	if (param.disabledSign) {
		this.disabledSign = param.disabledSign;
	}
	this.format = param.format;// money、icCard 内容格式化方式
	this.formatSignIndex = "";// 生成空格节点

	if (this.format == "icCard") {
		for ( var i = 0; i < 100;) {
			i = i + 4;
			this.formatSignIndex += "[" + i + "],";
			i++;
		}
	}
	if (this.format == "money") {
		for ( var i = 0; i < 100;) {
			i = i + 3;
			this.formatSignIndex += "[" + i + "],";
			i++;
		}
	}
	this.tip = param.tip;// email
	this.maxLength = parseInt(param.maxLength);// 允许录入长度
	this.init();
}
Keyboard.prototype = {
	init : function() {
		var thiz = this;
		this.el.attr("readonly", true);
		this.render.remove();
		this.content = $("<div class='content'><div>");
		this.render.append(this.content);
		$("body").append(this.render);
		this._create(this.mode);
		this.createCursor();
		// this.createInput();
		this.createEmailTip();
		// 点击文本框弹出键盘
		this.el.click(function() {
			thiz.show();
		});

		// 隐藏键盘1
		$.ui.bodyListener(function() {
			thiz.hide();
			thiz.$tip.hide();
		});
		this.render.hide();
	},
	/***************************************************************************
	 * 显示键盘
	 */
	show : function() {
		this.render.slideDown();
		this.showCursor();
	},
	/***************************************************************************
	 * 隐藏键盘
	 */
	hide : function() {
		this.render.slideUp();
		this.$cursor.hide();
	},
	/***************************************************************************
	 * 创建Email内容提示
	 */
	createEmailTip : function() {
		var thiz = this;
		var tips = [ "163.com", "qq.com", "hotmail.com", "sina.com", "gmail.com", "yahoo.com", "msn.com", "googlemail.com", "mail.com", "inbox.com", "sohu.com", "126.com", "21cn.com", "3721.net" ];
		var len = tips.length;
		this.$tip = $("<div class='keyboard-tip'></div>");
		this.$ul = $("<ul></ul>");

		for ( var i = 0; i < len; i++) {
			var li = $("<li>" + tips[i] + "</li>");
			li.mouseup(function() {
				var inputVal = thiz.el.val();
				var val = $(this).html();
				var rs = inputVal + val;
				if (rs.length >= thiz.maxLength) {
					return;
				}
				thiz.appendText(val);
				thiz.$tip.hide();
			});
			this.$ul.append(li);
		}

		this.$tip.append(this.$ul);
		$("body").append(this.$tip);
		this.$tip.hide();
	},
	/***************************************************************************
	 * 显示内容提示
	 */
	showEmailTip : function() {
		var elHeight = parseInt(this.el.css("height"));
		var renderHeight = parseInt(this.render.css("height"));
		var topPoint = 0;
		if (this.top - renderHeight < 0) {
			topPoint = this.top + elHeight + 10;
		} else {
			topPoint = this.top - renderHeight / 2 - elHeight;
		}
		topPoint = this.top - renderHeight / 2 - elHeight;
		var point = $.getPoint(this.el.get(0));
		this.left = parseInt(point.x);
		this.top = parseInt(point.y);
		this.$tip.css("left", this.left + "px");
		this.$tip.css("top", topPoint + "px");
		this.$tip.show();
	},
	/***************************************************************************
	 * 创建输入框
	 */
	createInput : function() {
		var txt = new ytd.tdj.TextBox({
			top : "6px",
			left : "78px"
		});
		this.$input = txt.getJQueryObject();
		this.render.append(this.$input);
	},
	/***************************************************************************
	 * 创建光标
	 */
	createCursor : function() {
		this.$cursor = $("<div class='keyboard-cursor'></div>");
		$("body").append(this.$cursor);
		this.$cursor.hide();
	},
	/***************************************************************************
	 * 显示光标
	 */
	showCursor : function() {
		var point = $.getPoint(this.el.get(0));
		this.left = parseInt(point.x);
		this.top = parseInt(point.y);
		this.$cursor.css("left", this.left + "px");
		this.$cursor.css("top", (this.top + 4) + "px");
		this.$cursor.show();
		// 显示键盘的时候，移动光标位置
		this.cursor = this.el.val().length;
		for ( var i = 0; i < this.cursor; i++) {
			this.cursorRight();
		}
	},
	/***************************************************************************
	 * 左移动光标
	 */
	cursorLeft : function() {
		var range = this.el.get(0).createTextRange();
		range.move('character', this.cursor);

		var offset = parseInt(range.offsetLeft - 7);
		this.$cursor.css("left", offset + "px");
	},
	/***************************************************************************
	 * 右移动光标
	 */
	cursorRight : function() {
		var range = this.el.get(0).createTextRange();
		range.move('character', this.cursor);

		var offset = parseInt(range.offsetLeft - 7);
		this.$cursor.css("left", offset + "px");
	},

	/***************************************************************************
	 * 追加文本
	 */
	appendText : function(cmd) {
		var range = this.el.get(0).createTextRange();
		range.move('character', this.cursor);
		range.text = range.text + cmd;
		range.select();
		var len = cmd.length;
		for ( var i = 0; i < len; i++) {
			this.cursor++;
			this.cursorRight();
		}

	},
	/***************************************************************************
	 * 回删
	 */
	backspace : function() {
		var range = this.el.get(0).createTextRange();
		var v1 = range.text.substring(this.cursor);
		range.moveStart('character', 0);
		range.collapse(true);
		this.cursor--;
		range.moveEnd('character', this.cursor);
		this.el.get(0).createTextRange().text = range.text + v1;
		range.move('character', this.cursor);
		range.select();
		this.cursorLeft();
	},
	/***************************************************************************
	 * 格式化显示内容
	 */
	formatText : function() {
		var range = this.el.get(0).createTextRange();
		range.moveStart('character', 0);
		range.collapse(true);
		range.moveEnd('character', this.cursor);
		val = range.text;
		var len = val.length;
		if (this.formatSignIndex.indexOf("[" + len + "]") != -1) {
			if (this.format == "icCard") {
				this.appendText(" ");
			}
			if (this.format == "money") {
				this.appendText(",");
			}
		}
	},
	/***************************************************************************
	 * 设置键盘界面元素
	 */
	setContent : function(pa) {
		if ($.isNotNull(pa.row1)) {
			this.keys_one = pa.row1.key;
			if (pa.row1.val != null) {
				this.vals_one = pa.row1.val;
			} else {
				this.vals_one = pa.row1.key;
			}
			if (pa.row1.disabled != null) {
				this.disabled_one = pa.row1.disabled;
			} else {
				this.disabled_one = [ false, false, false, false, false, false, false, false, false, false, false, false, false, false ];
			}
		}

		if ($.isNotNull(pa.row2)) {
			this.keys_two = pa.row2.key;
			if (pa.row2.val != null) {
				this.vals_two = pa.row2.val;
			} else {
				this.vals_two = pa.row2.key;
			}
			if (pa.row2.disabled != null) {
				this.disabled_two = pa.row2.disabled;
			} else {
				this.disabled_two = [ false, false, false, false, false, false, false, false, false, false, false, false, false, false ];
			}
		}

		if ($.isNotNull(pa.row3)) {
			this.keys_three = pa.row3.key;
			if (pa.row3.val != null) {
				this.vals_three = pa.row3.val;
			} else {
				this.vals_three = pa.row3.key;
			}
			if (pa.row3.disabled != null) {
				this.disabled_three = pa.row3.disabled;
			} else {
				this.disabled_three = [ false, false, false, false, false, false, false, false, false, false, false, false, false, false ];
			}
		}

		if ($.isNotNull(pa.row4)) {
			this.keys_four = pa.row4.key;
			if (pa.row4.val != null) {
				this.vals_four = pa.row4.val;
			} else {
				this.vals_four = pa.row4.key;
			}
			if (pa.row4.disabled != null) {
				this.disabled_four = pa.row4.disabled;
			} else {
				this.disabled_four = [ false, false, false, false, false, false, false, false, false, false, false, false, false, false ];
			}
		}
	},
	/***************************************************************************
	 * 创建键盘主题内容
	 */
	_create : function(mode) {
		var thiz = this;
		this.mode = mode;
		this.content.empty();
		var input = this.el;

		// 默认键值为"key或keyBlack"的，则站一个按键位置，无任何功能
		this.setContent({
			row1 : {
				key : [ "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "", "1", "2", "3" ],
				val : [ "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "back", "1", "2", "3" ]
			},
			row2 : {
				key : [ "", "a", "s", "d", "f", "g", "h", "j", "k", "l", "", "4", "5", "6" ],
				val : [ "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "caps", "4", "5", "6" ]
			},
			row3 : {
				key : [ "", "", "z", "x", "c", "v", "b", "n", "m", "", "符", "7", "8", "9" ],
				val : [ "key", "key", "z", "x", "c", "v", "b", "n", "m", "up", "sign", "7", "8", "9" ]
			},
			row4 : {
				key : [ "符", "@", "", "", "", "", "0", ".", "" ],
				val : [ "sign", "@", " ", "left", "down", "right", "0", ".", "back" ]
			}
		});

		// 小写字符为主的键盘
		if (this.mode == "lowercase") {
			this.charState = "small";
		}
		// 大写字符为主的键盘
		if (this.mode == "capital") {
			this.charState = "big";
			this.setContent({
				row1 : {
					key : [ "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "", "1", "2", "3" ],
					val : [ "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "back", "1", "2", "3" ]
				},
				row2 : {
					key : [ "", "A", "S", "D", "F", "G", "H", "J", "K", "L", "", "4", "5", "6" ],
					val : [ "caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", "caps", "4", "5", "6" ]
				},
				row3 : {
					key : [ "", "", "Z", "X", "C", "V", "B", "N", "M", "", "符", "7", "8", "9" ],
					val : [ "key", "key", "Z", "X", "C", "V", "B", "N", "M", "up", "sign", "7", "8", "9" ]
				},
				row4 : {
					key : [ "符", "@", "", "", "", "", "0", ".", "" ],
					val : [ "sign", "@", " ", "left", "down", "right", "0", ".", "back" ]
				}
			});
		}
		// 纯数字为主的键盘
		if (this.mode.indexOf("num") == 0) {
			this.disabledSign = true;

			this.setContent({
				row1 : {
					key : [ "1", "2", "3", "", "", "" ],
					val : [ "1", "2", "3", "key", "key", "back" ]
				},
				row2 : {
					key : [ "4", "5", "6", "", "", "" ],
					val : [ "4", "5", "6", "key", "key", "key" ]
				},
				row3 : {
					key : [ "7", "8", "9", "", "", "" ],
					val : [ "7", "8", "9", "key", "up", "key" ]
				},
				row4 : {
					key : [ "", "", "0", "", "", "", "", "" ],
					val : [ "", "", "0", "key", "key", "left", "down", "right" ]
				}
			});

			if (this.mode == "num1") {
				this.keys_four[3] = ".";
				this.vals_four[3] = ".";
			}
			if (this.mode == "num2") {
				this.keys_four[4] = "空格";
				this.vals_four[4] = " ";
			}
			if (this.mode == "num3") {
				this.keys_four[3] = ".";
				this.vals_four[3] = ".";

				this.keys_four[4] = "空格";
				this.vals_four[4] = " ";
			}
		}

		// 字符为主的键盘
		if (this.mode == "sign") {
			this.signState = "checked";
			this.setContent({
				row1 : {
					key : [ "", "~", "!", "@", "#", "$", "%", "^", "&", "*", "", "1", "2", "3" ],
					val : [ "key", "~", "!", "@", "#", "$", "%", "^", "&", "*", "back", "1", "2", "3" ]
				},
				row2 : {
					key : [ "", "(", ")", "-", "=", "[", "]", "{", "}", ";", "", "4", "5", "6" ],
					val : [ "caps", "(", ")", "-", "=", "[", "]", "{", "}", ";", "caps", "4", "5", "6" ]
				},
				row3 : {
					key : [ "", ":", ",", ".", "?", "•", "", "", "", "", "符", "7", "8", "9" ],
					val : [ "key", ":", ",", ".", "?", "•", "key", "key", "key", "up", "sign", "7", "8", "9" ]
				},
				row4 : {
					key : [ "符", "@", "", "", "", "", "0", ".", "" ],
					val : [ "sign", "@", " ", "left", "down", "right", "0", ".", "back" ]
				}
			});
		} else {
			this.signState = "unchecked";
		}

		// 是否在键盘上显示字符切换
		if (this.disabledSign) {
			this.disabled_four[0] = true;
			this.disabled_three[10] = true;
			this.disabled_four[1] = true;
		}
		// 点击按钮事件
		var key_click = function() {
			var cmd = $(this).attr("val");
			var val = input.val();
			if (cmd == "") {
				return;
			}
			if (cmd == "back") {
				if (thiz.cursor <= 0) {
					return;
				}
				thiz.backspace();// 回删除
			} else if (cmd == "caps") {
				// 大小写字符切换
				if (thiz.charState == "small") {
					thiz._create("capital");
					thiz.charState = "big";
				} else if (thiz.charState == "big") {
					thiz._create("lowercase");
					thiz.charState = "small";
				}

			} else if (cmd == "left" || cmd == "right" || cmd == "up" || cmd == "down") {
				thiz.move(input, cmd);// 左右上下移动光标
			} else if (cmd == "sign") {
				// 符号切换
				if (thiz.mode == "sign" && thiz.charState == "big") {
					thiz._create("capital");
				} else if (thiz.mode == "sign" && thiz.charState == "small") {
					thiz._create("lowercase");
				} else {
					thiz._create("sign");
				}
			} else if (cmd != "key" && cmd != "keyBlack") {
				if (val.length >= thiz.maxLength) {
					return;
				}
				if (thiz.format != null) {
					thiz.formatText();// 格式化内容
				}
				thiz.appendText(cmd);// 追加文本
			}

			// 辅助功能
			if (thiz.tip == "email" && cmd == "@") {
				thiz.showEmailTip();// 显示邮件提示信息
			}
		};
		var key_up = function() {
			input.focus();
		};
		// 获取按键样式表
		var getclassName = function(key, val) {
			var clasz = "";
			if (val == "caps") {
				if (thiz.charState == "small") {
					clasz = "keycaps";
				} else if (thiz.charState == "big") {
					clasz = "keycaps_checked";
				} else {
					clasz = "keycaps";
				}
			}
			if (val == " " && key == "") {
				clasz = "keyspace";
			}
			if (val == "left") {
				clasz = "keyleft";
			}
			if (val == "down") {
				clasz = "keydown";
			}
			if (val == "right") {
				clasz = "keyright";
			}
			if (val == "up") {
				clasz = "keyup";
			}
			if (val == "back") {
				clasz = "keyback";
			}
			if (val == "sign") {
				if (thiz.signState == "unchecked") {
					clasz = "keysign";
				} else if (thiz.signState == "checked") {
					clasz = "keysign_checked";
				} else {
					clasz = "keysign";
				}
			}
			return clasz;
		};

		var createKey = function(key, val, disabled, top, left, offset) {
			var clasz = getclassName(key, val);
			var $key = $("<div class='key " + clasz + "' val='" + val + "' >" + key + "</div>");
			$key.css("top", top + "px");
			$key.css("left", left + "px");
			if (val == "" && clasz == "") {
				$key.hide();
			} else {
				thiz.disabledKey($key, disabled);
				$key.mousedown(key_click);
				$key.mouseup(key_up);
				thiz.content.append($key);
				left = left + parseInt($key.css("width")) + offset;
				if (val == "keyBlack") {
					$key.css("background", "#000");
				}
			}

			return left;
		};

		var offset = 6;
		// /////////////1//////////////////
		var top = 2;
		var left = 5;
		var len = this.keys_one.length;
		for ( var i = 0; i < len; i++) {
			left = createKey(this.keys_one[i], this.vals_one[i], this.disabled_one[i], top, left, offset);
			if (this.mode.indexOf("num") == -1 && i == 10) {
				left = left + 20;
			}
		}

		// /////////////2//////////////////
		top = 63;
		left = 5;
		len = this.keys_two.length;
		for ( var i = 0; i < len; i++) {
			left = createKey(this.keys_two[i], this.vals_two[i], this.disabled_two[i], top, left, offset);
			if (this.mode.indexOf("num") == -1 && i == 10) {
				left = left + 20;
			}
		}
		// /////////////3//////////////////
		top = 125;
		left = 5;
		len = this.keys_three.length;
		for ( var i = 0; i < len; i++) {
			left = createKey(this.keys_three[i], this.vals_three[i], this.disabled_three[i], top, left, offset);
			if (this.mode.indexOf("num") == -1 && i == 10) {
				left = left + 20;
			}
		}
		// /////////////4//////////////////
		top = 185;
		left = 5;
		len = this.keys_four.length;
		for ( var i = 0; i < len; i++) {
			left = createKey(this.keys_four[i], this.vals_four[i], this.disabled_four[i], top, left, offset);
			if (this.mode.indexOf("num") == -1 && i == 5) {
				left = left + 20;
			}

		}

		this.content.css("width", left + "px");// 设置键盘内容的宽度

		// 当为数字键盘的时候，样式特殊处理
		if (this.mode.indexOf("num") == 0) {
			this.content.css("border", "1px solid #9fa0a0");
			this.content.css("box-shadow", "2px 2px 4px #999");
			this.content.css("border-radius", "5px");
			this.content.css("radius", "10px");
		}
		this.mode = mode;
	},
	disabledKey : function(key, disabled) {
		if (disabled) {
			key.css("background", "#302f37");
			key.html("");
		}
		key.prop("disabled", disabled);
	},
	move : function(obj, to) {
		var len = obj.get(0).value.length;
		var range = obj.get(0).createTextRange();
		if (to == "left") {
			this.cursor--;
			if (this.cursor >= 0) {
				range.move('character', this.cursor);
				this.cursorLeft();
			} else {
				this.cursor++;
				return;
			}
		}
		if (to == "right") {
			this.cursor++;
			if (this.cursor <= len) {
				range.move('character', this.cursor);
				this.cursorRight();
			} else {
				this.cursor--;
				return;
			}
		}
		if (obj.cols) {
			if (to == "up") {
				var t = this.cursor - obj.cols;
				if (t <= 0) {
					return;
				} else {
					range.move('character', t);
					this.cursor = t;
				}
			}
			if (to == "down") {
				var t = this.cursor + obj.cols;
				if (t >= len) {
					return;
				} else {
					range.move('character', t);
					this.cursor = t;
				}
			}
		}
		range.select();
	}
};
/*******************************************************************************
 * 数字键盘
 */
function NumKeyboard(param) {
	this.render = param.render;
	this.el = param.el;
	this.mode = param.mode;// num;
	this.maxLength = parseInt(param.maxLength);// 允许录入长度
	this.init();
}
NumKeyboard.prototype = {
	init : function() {
		var thiz = this;
		this.el.attr("readonly", true);
		var $numkey = this.render;
		var input = this.el;
		var keys = [];
		var vals = [];
		if (this.mode == "num") {
			keys = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, ".", "" ];
			vals = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, ".", "回删" ];
		}
		if (this.mode == "onlyNum") {
			keys = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "", "" ];
			vals = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "", "回删" ];
		}
		if (this.mode == "spaceNum") {
			keys = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "空格", "" ];
			vals = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, " ", "回删" ];
		}

		var key_click = function() {
			var val = input.val();
			var cmd = $(this).attr("val");
			if (cmd == "回删") {
				input.val(input.val().substring(0, val.length - 1));
			} else {
				if (val.length >= thiz.maxLength) {
					return;
				}
				input.val(input.val() + cmd);
			}
		};
		var key_up = function() {
			input.focus();
		};

		var len = keys.length;
		for ( var i = 0; i < len; i++) {
			var $key = $("<div class='key key" + i + "' val='" + vals[i] + "' >" + keys[i] + "</div>");
			$key.mousedown(key_click);
			$key.mouseup(key_up);
			$numkey.append($key);
		}

		$numkey.css("right", "0px");
		$numkey.css("top", "70px");
		$numkey.show();
	}
};

/*******************************************************************************
 * loading效果
 */
function Loading() {
	this.loadingDiv = null;
	this.loadingmask = null;
	this.init();
}
Loading.prototype = {
	init : function() {
		this.loadingDiv = $('<div id="loading"></div>');
		this.loadingmask = $('<div id="loadingmask"></div>');
		var child = $('<div id="load"><div id="loadIco1"></div><div id="loadIco2"></div><div id="loadText">loading</div></div><div id="loadShadow"></div>');
		this.loadingDiv.append(child);
		$('body').append(this.loadingmask);
		$('body').append(this.loadingDiv);

	},
	show : function() {
		this.loadingDiv.show();
		this.loadingmask.show();
	},
	remove : function() {
		this.loadingDiv.remove();
		this.loadingmask.remove();
	}
};

/*******************************************************************************
 * 国家
 */
function Nation(param) {
	this.render = param.render;
	this.el = param.el;
	this.id = param.id;
	this.data = [ {
		itemName : "中国",
		itemValue : "110"
	}, {
		itemName : "阿根廷",
		itemValue : "120"
	}, {
		itemName : "美国",
		itemValue : "130"
	}, {
		itemName : "阿尔巴吉尼亚斯坦",
		itemValue : "131"
	} ];
	this.init();
}
Nation.prototype = {
	init : function() {
		this.loadData();
		// this.initPage();

	},
	/***************************************************************************
	 * 加载数据
	 */
	loadData : function() {
		var thiz = this;
		this.data = $.session().nationData;
		if ($.isNull(this.data)) {
			this.options = {
				success : function(data) {
					thiz.data = data;
					thiz.initPage();
				},
				categoryid : "119406"
			};
			PMU.Commu.getStandardCode(this.options);
		} else {
			thiz.initPage();
		}
	},
	/***************************************************************************
	 * 按字母顺序排序
	 */
	sort : function() {
		// 添加国家拼音首字母
		$.each(this.data, function(index, value) {
			var py = $.ccHz2Py(value.itemName);
			var py_initials = py.split(" ");
			var py_initial = "";
			value.initial = py.charAt(0);
			$.each(py_initials, function(i, v) {
				py_initial += v.charAt(0);
			});
			value.fullInitial = py_initial;
		});
		// 排序
		var initialOrder = this.data.sort(function(a, b) {
			if (a.initial < b.initial)
				return -1;
			if (a.initial > b.initial)
				return 1;
			return 0;
		});
		this.data = initialOrder;
	},
	/***************************************************************************
	 * 初始化页面
	 * 
	 * @param nations
	 */
	initPage : function() {
		var thiz = this;
		this.sort();
		this.el.click(function() {
			thiz.show();
		});

		this.nationBar = $('<div class="nationBar">');

		this.nation = $('<div class="nation">');
		this.title = $('<div class="title">国家（地区）名称代码表</div>');
		this.close = $('<div class="close"></div>');
		this.close.click(function() {
			thiz.hide();
		});

		// 搜索栏
		this.searchBar = $('<div class="search">');
		this.searchTitle = $('<span>搜索关键字</span>');
		this.searchText = $('<input type="text"/>');
		this.searchBtn = $('<input type="button" value="搜索"/>');
		this.cancelBtn = $('<input type="button" value="撤销"/>');
		this.searchTips = $('<span style="color:red">*允许输入国家（地区）中文名称，或拼音缩写进行模糊查询</span>');
		this.searchBar.append(this.searchTitle).append(this.searchText).append(this.searchBtn).append(this.cancelBtn).append(this.searchTips);

		this.searchBtn.click(function() {
			var key = thiz.searchText.val().toUpperCase();
			thiz.createContent([ key ], "like");
		});
		this.cancelBtn.click(function() {
			thiz.createContent();
		});

		this.hr = $('<hr/>');

		// 快捷按钮
		this.shortcut = $('<div class="shortcut"></div>');
		this.ABCDEF = $('<span>ABCDEF</span>');
		this.GHIJKL = $('<span>GHIJKL</span>');
		this.MNOPQ = $('<span>MNOPQ</span>');
		this.RSTUVW = $('<span>RSTUVW</span>');
		this.XYZ = $('<span>XYZ</span>');
		this.shortcut.append(this.ABCDEF).append(this.GHIJKL).append(this.MNOPQ).append(this.RSTUVW).append(this.XYZ);

		this.ABCDEF.mousedown(function() {
			thiz.createContent([ "A", "B", "C", "D", "E", "F" ]);
		});
		this.GHIJKL.mousedown(function() {
			thiz.createContent([ "G", "H", "I", "J", "K", "L" ]);
		});
		this.MNOPQ.mousedown(function() {
			thiz.createContent([ "M", "N", "O", "P", "Q" ]);
		});
		this.RSTUVW.mousedown(function() {
			thiz.createContent([ "R", "S", "T", "U", "V", "W" ]);
		});
		this.XYZ.mousedown(function() {
			thiz.createContent([ "X", "Y", "Z" ]);
		});

		// 内容
		this.content = $('<div class="content">');
		this.table = $('<table>');
		this.content.append(this.table);

		this.nation.append(this.title).append(this.close).append(this.searchBar).append(this.hr).append(this.shortcut).append(this.content);
		this.nationBar.append(this.nation);
		$("body").append(this.nationBar);

		this.createContent();
	},
	show : function() {
		this.nationBar.show();
	},
	hide : function() {
		this.nationBar.hide();
	},
	/***************************************************************************
	 * 创建内容
	 */
	createContent : function(filter, type) {
		var thiz = this;
		this.table.empty();
		var chars = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ];
		if (filter != null) {
			chars = filter;
		}
		$(chars).each(function() {
			var thisChar = this;
			var tr = $('<tr>');
			var td1 = $('<td valign="top" width="160px"><span>' + this + '</span></td>');
			var td2 = $('<td></td>');
			var ul = $('<ul>');
			td2.append(ul);
			tr.append(td1).append(td2);

			var i = 0;
			// 循环国家数据
			$(thiz.data).each(function() {
				var initial = this.initial;
				var fullInitial = this.fullInitial;
				var name = this.itemName;
				var value = this.itemValue;
				var flag = true;
				if (type != null) {
					flag = initial.indexOf(thisChar) != -1 || fullInitial.indexOf(thisChar) != -1 || name.indexOf(thisChar) != -1;
				} else {
					flag = initial.indexOf(thisChar) == 0 || fullInitial.indexOf(thisChar) == 0 || name.indexOf(thisChar) == 0;
				}
				if (flag) {
					var li = $('<li>');
					li.html(name);
					li.attr("value", value);
					li.attr("initial", initial);
					li.attr("fullInitial", fullInitial);
					li.click(function() {
						thiz.el.attr("value", $(this).attr("value"));
						thiz.el.find("~ div").html("<b>" + name + "</b>");
						thiz.el.attr("text", name);
						thiz.hide();
					});
					ul.append(li);
					i++;
				}
			});

			if (i != 0) {
				thiz.table.append(tr);
			}
		});
	}
};

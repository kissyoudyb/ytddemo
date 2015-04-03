/**
 * Created by akang on 14-5-13.
 * Modified by zhangyz on 14-7-22:modify the getAreaData function
 */
(function($){
    window.PMU = window.PMU || {};
    PMU.html = PMU.html || {};
    PMU.html.utils = PMU.html.utils || {};

    PMU.html.utils.alert = function(msg){
        if($.fn.alertbox){
            $(window.document.body).alertbox({
                'message': msg,
                '确定':function() { this.close(); }
            });
        }else{
            alert(msg);
        }
    }

    PMU.html.utils.getAreaData = function(formId){
        if(!formId) {
            PMU.html.utils.alert.show("getAreaData参数错误!formId不能为空!", null,"提示");
            return;
        }

        var f = document.getElementById(formId);
        
        /*added by zhangyz 2014/7/22*/
        var result = {};
        var elements = "input;select;textarea";
        var f_input=f.getElementsByTagName("input");
        var f_select=f.getElementsByTagName("select");
        var f_textarea=f.getElementsByTagName("textarea");
        for(var i = 0 ; i < f_input.length+f_select.length+f_textarea.length; i++){ // for every input element in form
            var e=null;
        	if(i<f_input.length){
            	e = f_input[i];
            }
            else if((i>f_input.length||i==f_input.length) && i<f_input.length+f_select.length){
            	e = f_select[i-f_input.length];
            }
            else if(i>f_input.length+f_select.length||i==f_input.length+f_select.length){
            	e = f_textarea[i-f_input.length-f_select.length];
            }
        	
            if(elements.indexOf(e.tagName.toLowerCase()) == -1)
                continue;  // 跳过 button等

            if(!e.name)
                continue;  // 跳过无name

            // 初始化
            if(result[e.name] == null){
                if( e.type.toLowerCase() == "checkbox" && e.tagName.toLowerCase() == "input")
                    result[e.name] = [];
                else
                    result[e.name] = "";
            }
            var value = getFormElementValue(e);
            if(value != null){
                value = $.trim(value);
                if($.isArray(result[e.name]))
                    result[e.name].push(value);// checkbox
                else
                    result[e.name] = value;
            }
        }
        return result;
        /*added by zhangyz 2014/7/22*/
        
        
        /*if(f && f.tagName.toLowerCase() !== "form"){
            PMU.html.utils.alert.show("getAreaData参数错误!", null,"提示");
            return;
        }
        var result = {};
        var elements = "input;select;textarea";
        for(var i = 0 ; i < f.elements.length; i++){ // for every input element in form
            var e = f.elements[i];
            if(elements.indexOf(e.tagName.toLowerCase()) == -1)
                continue;  // 跳过 button等

            if(!e.name)
                continue;  // 跳过无name

            // 初始化
            if(result[e.name] == null){
                if( e.type.toLowerCase() == "checkbox" && e.tagName.toLowerCase() == "input")
                    result[e.name] = [];
                else
                    result[e.name] = "";
            }
            var value = getFormElementValue(e);
            if(value != null){
                value = $.trim(value);
                if($.isArray(result[e.name]))
                    result[e.name].push(value);// checkbox
                else
                    result[e.name] = value;
            }
        }
        return result;*/
    }

    function getFormElementValue(ele){
        var tag =  ele.tagName.toLowerCase();
        // 检测tag
        if(tag == "select"){
        	if(ele.options.length == 0 || ele.selectedIndex == -1) return "";
            return ele.options[ele.selectedIndex].value;
        }else if(tag == "textarea"){
            return ele.value;
        }else{ // input
            // 检测type
            switch (ele.type.toLowerCase()){
                case 'text' :
                case 'number':
                // 检测data-type
                    return getWidgetValue(ele);
                case 'checkbox':
                    if(ele.checked){
                        return ele.value;
                    }
                case 'radio':
                    if(ele.checked) return ele.value;
                    else return null;
                case 'password' :
                default:
                    return ele.value;
            }
        }
    }

    function getWidgetValue(ele){
        var jd = $(ele);
        var type = jd.data("inputtype");
        if(!type) {  // not widget
            if(jd.hasClass("nation_input"))
                return ele._inputValue;  // 国家选择框
            else
                return ele.value;
        }
        var funcName = "input" + type.substring(0,1).toUpperCase() + type.substring(1);
        if(typeof jd[funcName] == "function")
            return jd[funcName]("getValue"); // 取组件值
        else{
            //window.PMU.utils.alert("组件"+type + "函数" + funcName + "未找到");
            PMU.html.utils.alert.show("组件"+type + "函数" + funcName + "未找到", null,"提示");
            return null;  // not found
        }
    }

    /*
     * 将data的数据(json格式)根据form里面元素的name赋予对应的值，请注意，这里的对应关系是key->name,请确保name的唯一性
     * prefix是可选属性，如果设置了此值则会根据prefix_key的方式去寻找对应的id，这里的formId是无用的
     * invalidFlag为true 触发验证 为false 不触发验证
     */
    PMU.html.utils.setAreaData = function(data, formId, invalidFlag, prefix){
        if (!data) {
            //PMU.html.utils.alert('getAreaData参数错误!data不能为空!');
            PMU.html.utils.alert.show("getAreaData参数错误!data不能为空!", null,"提示");
            return;
        }
        var el;
        if (invalidFlag == null) {
            invalidFlag = true; //默认为true
        }

        if(typeof prefix == "string"){ // 根据prefix_key的方式去寻找对应的id，这里的formId是无用的
            for(var key in data){
                var id = prefix + "_" + key;
                var jd = $("#"+id);
                if(jd.length == 1){
                    setFormElementData(jd,value);
                }
            }
        }else{
        	var jform = null;
        	if(typeof formId == 'object' && formId.jquery){// 如果是query对象
        		jform = formId;
        	}else{
        		jform = $("#"+ formId);
        	}  
        		
            for(var key in data){
                var jd = jform.find("[name="+key+"]");
                setFormElementData(jd,data[key]);
            }
        }
    }


    function setFormElementData(jd,value){
        if(jd.length == 1){
            setSingleEleValue(jd,value);
        }else if(jd.length > 1){ // radio ,checkbox
            if($.isArray(value)){ // checkbox
                jd.each(function(){
                   if($.inArray(this.value,value)) this.checked = true;
                });
            }else{ // radio
                jd.each(function(){
                    if(this.value == value) this.checked = true;
                });
            }
        }
    }

    function setSingleEleValue(jd,value){
        var tag =  jd[0].tagName.toLowerCase();
        // 检测tag
        if(tag == "select"){
            setSelectValue(jd,value);
        }else if(tag == "textarea"){
            jd.val(value);
        }else{ // input
            // 检测type
            switch (jd[0].type.toLowerCase()){
                case 'text' :
                case 'number':
                    // 检测data-type
                    setWidgetValue(jd,value);
                case 'password' :
                default:
                    jd.val(value);
            }
        }
    }

    function setSelectValue(jd,value){
        if(!jd.hasClass("pm-area-select")){
            for(var i = 0 ; i < jd[0].options.length; i++){
                if(jd[0].options[i].value == value){
                    jd[0].options[i].selected = true;
                    return;
                }
            }
        }else{// 是地址联动
            var index = -1;
            var arr = null;
            if(/0000$/.test(value)){ // 省
                arr = PMU.html.utils.queryProvince();
            }else if(/00$/.test(value)){ // 市
                arr = PMU.html.utils.queryCity(value.substr(0,2)+"0000");
            }else{ // 区
                arr = PMU.html.utils.queryCounty(value.substr(0,4)+"00");
            }
            if(arr) index = arraySearch(arr,"itemValue",value);  // 取出相应的list之后，插入
            if(index != -1){
                PMU.html.utils.addAsOption(arr,jd[0],true,arr[index].itemName);
            }
        }
    }

    // 在指定array中item的指定property值为value的第一个item的index
    function arraySearch(arr,property,value,startIndex){
        if(!startIndex) startIndex = 0;
        for(var i = startIndex ; i < arr.length; i++){
            if(arr[i][property] == value)
                return i;
        }
        return -1;
    }

    function setWidgetValue(jd,value){
        var type = jd.data("inputtype");
        if(!type) {  // not widget
            if(jd.hasClass("nation_input")){
                $.each($.iNation.nationData,function(i,item){// 国家选择框
                    if(item.itemValue == value){
                         jd.val(item.itemName + "-" + item.itemValue);
                        jd[0]._inputValue = value;
                        return false;
                    }
                });
            }else
                jd.val(value);

            return;
        }
        var funcName = "input" + type.substring(0,1).toUpperCase() + type.substring(1);
        if(typeof jd[funcName] == "function")
            return jd[funcName]("setValue",value); // 取组件值
        else
            //window.PMU.utils.alert("组件"+type + "函数" + funcName + "未找到");
            PMU.html.utils.alert.show("组件"+type + "函数" + funcName + "未找到", null,"提示");
    }
PMU.utils.alert = function(msg){
	PMU.html.utils.alert.show(msg,null,"错误",3);
};
})(jQuery);
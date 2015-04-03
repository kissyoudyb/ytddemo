/**
 * Created by akang on 14-2-21.
 */
(function($){
    window.PMU = window.PMU || {};
    window.PMU.utils = window.PMU.utils || {};

    /* 读取url中？后指定的参数 */
    window.PMU.utils.getUrlParam = function(paramName){
        var i = window.location.href.indexOf("?");
        if(i == -1) return;// no params
        var search = window.location.href.substring(i+1);

        var reg = new RegExp("(^|&)"+ paramName +"=([^&]*)(&|$)");
        var r = search.match(reg);
        if (r!=null) return decodeURIComponent(r[2]);
        return null;
    }
    /* 读取url中？后所有的参数，返回对象 */
    window.PMU.utils.getUrlParams =  function(){
        var i = window.location.href.indexOf("?");
        if(i == -1) return;// no params
        var search = window.location.href.substring(i+1);

        var params = new Object();
//        var startpos = window.location.href.indexOf("?");
        var pieces = decodeURIComponent(search).split("&");
        for(var i = 0; i < pieces.length; i++)
        {
            try
            {
                var keyvalue = pieces[i].split("=");
                params[keyvalue[0]] = keyvalue[1];
            }
            catch(e){}
        }
        return params;
    }

    // 将key添加或者更新到url中
    window.PMU.utils.UpdateUrlParam = function(url, key, value) {
        var r = url;
        if (r) {
            value = encodeURIComponent(value);
            var reg = new RegExp("(^|)" + key + "=([^&]*)(|$)");
            var tmp = key + "=" + value;
            if (url.match(reg) != null) {
                r = url.replace(eval(reg), tmp);
            }
            else{
                if (url.match("[\?]")) {
                    r = url + "&" + tmp;
                } else {
                    r = url + "?" + tmp;
                }
            }
        }
        return r;
    }

    window.PMU.utils.UpdateUrlParams = function(url , obj , isAppend){
//        var loc = window.location;
//        var url = "";
//        if(isAppend){
//            url = loc.protocol + "//" + loc.host + loc.pathname;
//        }else{
//            url = loc.href;
//        }
        for(var key in obj){
            url = window.PMU.utils.UpdateUrlParam(url, key, obj[key]);
        }
        return url;
    };


    /**
     * 将相对路径转换为绝对路径
     *
     * @private
     * @method  relative2Abs
     * @param   relative_uri {String}   指定文件的相对路径
     * @param   base_uri {String}       基于的 uri
     * @return  {String}
     */
    window.PMU.utils.relative2Abs = function(base, relative){
//        console.log("base:" + base + " -- relative: " + relative);
        if(relative.indexOf("/")==0){
            return relative;
        }else if(relative.indexOf("./")==0){
            relative=relative.substring(2);
        }

        if(base[base.length-1]!="/"){// 不以/结尾
            base=base.substring(0,base.lastIndexOf("/"));
        }else{// 以/结尾 去掉末尾/
            base=base.substr(0,base.length-1);
        }
        var count=0,index=0;
        while(relative.indexOf("../")==0){
            relative=relative.substring(3);
            index = base.lastIndexOf("/");
            if(base.substring(index + 1 ,base.length) == "..") break;  // 基路径也可能是相对其它的路径
            base=base.substring(0,base.lastIndexOf("/"));
        }
        if(base) base = base + "/";
//        console.log("result:" + base + relative);
        return base + relative;
    };
    PMU.utils.toSinglePath = function(path){
        return PMU.utils.relative2Abs(SinglePageApp.loaded_page_abs_path,path);
    };
    // 计算path2对path1的相对路径
    window.PMU.utils.relative = function(path1,path2){
        var arr1 = path1.split("/");
        var arr2 = path2.split("/");
        for(var i = 0 ; i < arr1.length; i++){
            if(!arr1[i]) continue;
    }
    };
    // 计算path相对singlePage的相对路径，
    // 假设1. singlePage处于管理的网页的最外层
    // 假设2. path是网站上的绝对路径
    window.PMU.utils.relative2Single = function(path){
        var i = path.lastIndexOf("/");
        path = path.substr(0,i+1);
        var base = SinglePageApp.getBasePagePath();
        if(path == base)
            return "./";
        // 找到第一个不一样的字符
        for(var i = 0 ; i < base.length && path.length ;i++){
            if(base[i] == path[i])
                continue;
        }
//        base = base.substr(i);
        path = path.substr(i);
        return path; // 假设1. singlePage处于管理的网页的最外层
    };

    /**
     *
     * @param path 要加载的css的路径, 可以是数组
     * @param _class 要给该link标签加上的class <link class="_class" href="path" rel='stylesheet/dynamic'/>
     * @param isDynamic 是否是dynamic标签
     */
    window.PMU.utils.loadCss = function (path, _class , isDynamic){
        var arr = null;
        if($.isArray(path)){
            arr = path;
        }else{
            arr = [path];
        }
        for(var i = 0 ; i < arr.length ; i++){
            /*JavaScript动态加载Css文件*/
            var cssNode = document.createElement('link');
            if(isDynamic) cssNode.rel = 'stylesheet/dynamic';
            else cssNode.rel = 'stylesheet';
            cssNode.type = 'text/css';
    //        cssNode.media = 'screen';
            cssNode.href = arr[i];
            if(_class) cssNode.className = _class;
    //    cssNode.href = 'style.css?t='+new Date().getTime();/*附带时间参数，防止缓存*/
            document.head.appendChild(cssNode);
        }
    }

    /**
     *
     * @param files 要加载的js的路径,可以是数组
     * @param _class 要给该script标签加上的class
     * @param callBack 加载成功后的回调函数
     */
    window.PMU.utils.loadScript = function(files, _class , callBack){
        $LAB.setOptions({AlwaysPreserveOrder:true})
        .script(files)
        .wait(function(){
            callBack();
        });
        // var selector = "script";
        // if(_class) selector = selector + "." + _class;
        // $(selector).each(function(){
        //     if(this.id == path) {
        //         selector = false;
        //         return false;
        //     } // 已加载，不重复加载, break
        // })
        // if(!selector) return;

        // var node = document.createElement('script');
        // node.type = 'text/javascript';
        // if(_class) node.className = _class;
        // node.id = path;
        // node.src = path;
        // node.async = true;
        // $(node).bind("load",callBack);
        // document.head.appendChild(node);
    }

    /**
     * 页面跳转
     * @param url
     * @param isForce  是否强制跳转
     * @param isCache  是否缓存当前页
     */
    window.PMU.utils.goto = function(url,isForce,isCache){
        console.log("utils:goto page " + url);
        if(window.SinglePageApp)
            window.SinglePageApp.gotoPage(url,false,isForce,isCache);
        else
            window.location.href = url;
    }

    /**
     *  回退指定的页数，默认为1
     * @param num
     */
    window.PMU.utils.goBack = function(num){
        
        if(window.SinglePageApp)
            window.SinglePageApp.goBack(num);
        else{
            if(num != undefined && typeof num == "number") window.history.go(-num);
            else window.history.back();
        }
    }

    // 页面跳转
    window.PMU.utils.toURL = PMU.utils.goto;

    // 刷新页面
    window.PMU.utils.refresh = function(){
        if(window.SinglePageApp)
            window.SinglePageApp.refresh();
        else{
            window.location.reload();
        }
    }

    window.PMU.utils.Cache = {};
    window.PMU.utils.Cache.set = function(obj){
        if(window.SinglePageApp)
            window.SinglePageApp.setCache(obj);
        else{
            sessionStorage.setItem("_util_cache_single_", JSON.stringify(obj));
        }
    }
    window.PMU.utils.Cache.get = function(){
        if(window.SinglePageApp)
            return window.SinglePageApp.getCache();
        else{
            return JSON.parse(sessionStorage.getItem("_util_cache_single_"));
        }
    }
    window.PMU.utils.Cache.clear = function(){
        if(window.SinglePageApp)
            return window.SinglePageApp.clearCache();
        else{
            sessionStorage.removeItem("_util_cache_single_");
        }
    }
    window.PMU.utils.Cache.setKeyValue = function(key,value){
        if(window.SinglePageApp)
            window.SinglePageApp.setStorageItem(key,value);
        else{
            sessionStorage.setItem(key, JSON.stringify(value));
        }
    }
    window.PMU.utils.Cache.getKeyValue = function(key){
        if(window.SinglePageApp)
            return window.SinglePageApp.getStorageItem(key);
        else{
            try{
                return JSON.parse(sessionStorage.getItem(key));
            }catch (e){
                return sessionStorage.getItem(key);  // JSON解析失败
            }
        }
    }
    // key != null 的时候，清楚指定key的值，key == null的时候，清楚所有键值对
    window.PMU.utils.Cache.clearKeyValue = function(key){
        if(!key) console.info("!!!clear all KeyValue");
        if(window.SinglePageApp)
            window.SinglePageApp.clearStorageItem(key);
        else{
            if(key) sessionStorage.removeItem(key);
//            else sessionStorage.clear();
//            sessionStorage.clear();
        }
    }

    //* 持久化存储item
    window.PMU.utils.Storage = {};
    /**
     * 异步，持久化存储item
     * @param key
     * @param obj
     * @param success 成功回调函数，没有则不调用
     * @param error 失败回调函数，没有则不调用
     */
    window.PMU.utils.Storage.persistentItem = function(key,obj,success,error){
        PMU.Storage.localSave(key,obj);
    }
    /**
     * 异步，获取持久化item，不存在时返回null
     * @param key
     * @param isJSON  指定存储的是否是json对象，true则会进行json解析，返回json对象
     * @param success  成功回调函数，没有则不调用
     * @param error  失败回调函数，没有则不调用
     */
    window.PMU.utils.Storage.getPersistent = function(key,isJSON,success,error){
        return PMU.Storage.localGet(key,isJSON);
    }
    /**
     * 异步，移除指定key的持久化item
     * @param key key为null时，则移除所有持久化的数据
     * @param success
     * @param error
     */
    window.PMU.utils.Storage.removePersistent = function(key,success,error){
        PMU.Storage.localRemove(key);
    }

    // 包装过的alert函数
    window.PMU.utils.alert = function(msg){
        if($.fn.alertbox){
            $(window.document.body).alertbox({
                'message': msg,
                'buttons':[{
                    "title":"确定",
                    "class":"ok",
                    "handler":function(){this.close();}
                }]
            });
        }else{
            alert(msg);
        }
    };

    // 需要自定义handler的alertBox
    window.PMU.utils.alertHandler = function(msg,buttons) {
        $(document.body).alertbox({
            message:  msg,
            buttons: buttons
        });
    };

    //确认提示框comfirm
    window.PMU.utils.comfirm = function(msg,handler){
        $("body").alertbox({
            message:msg,
            buttons:[{
                title:"确定",handler:handler
            },{
                title:"取消",handler:function(){this.close()}
            }]
        })
    }
    // 取obj指定路径下的值，无返回null
    window.PMU.utils.getValue = function(obj,path){
        var keys=path.split(".");
        for(var k in keys){
            k=keys[k];
            if(obj[k] == undefined) return null;
            obj=obj[k];
        }
        return obj;
    };
    // 设置obj指定路径下的值，无该路径返回null
    window.PMU.utils.setValue = function(source,path,value){
        if(!source) return;
        var keys=path.split(".");
        var obj = source;
        var last = source;
        var k = null;
        for(var i = 0 ; i < keys.length; i++){
            k = keys[i];
            if(obj[k] == undefined) return null;
            last = obj;
            obj = obj[k];
    }
        last[k] = value;
        return source;
    };

    // 如果不是array，弄成array
    window.PMU.utils.uni2Array = function(objArr){
        if(!$.isArray(objArr)){
            return [objArr];
        }else{
            return objArr;
        }
    }

    // "http://128.160.97.212:17002"
    window.PMU.utils.getHttpBase = function(){
        return window.location.protocol + "//" + window.location.host;
    }

    PMU.utils.getRandom = function(){
        return (new Date().getTime()) + Math.random();
    }

    PMU.utils.inArray = function(arr,value,key){
        var v = null;
        for(var i = 0 ; i < arr.length ; i++){
            v = key ? arr[i][key] : arr[i];
            if(v == value) return i;
        }
        return -1;
    }

    PMU.utils.getActiveBottom = function(){
        return window.innerHeight - document.activeElement.getBoundingClientRect().bottom;
    }

    /**
     * 为select元素添加option
     * @param eid  select element id
     * @param sdata  array data to add as options
     * @param oname  name for text
     * @param ovalue name for value
     * @param clear   is should clear select element's options first
     */
    PMU.utils.addSelectOption = function(eid,sdata,oname,ovalue,clear){
        var d = eid;
        if(clear === true) d.empty();
        $.each(sdata,function(i,o){
            var option = $("<option></option>").attr("value", o[ovalue]).text(o[oname]);
            $(eid).append(option);
        });
    };

    // 判断是否发往localhost
    var _localHttpHead = [/^http:\/\/localhost/,/^http:\/\/127.0.0.1/];
    PMU.utils.isLocalHTTP = function(url){
        for(var i = 0 ; i < _localHttpHead.length ; i++){
            if(_localHttpHead[i].test(url))
            return true;
        }
        return false;
    };
    PMU.utils.printStack = function(msg){
        console.error(JSON.stringify(new Error(msg)));
    };
    /**
     * 将obj转换为可以附加在url后面的格式，嵌套的obj，直接stringify
     * @param obj
     */
    PMU.utils.param = function(obj,noEncode){
        if(!obj) return;
        var func = null;
        if(noEncode == true){  // encode or not
            func = function(s){return s};
        }else{
            func = encodeURIComponent;
    }

        if(typeof obj == 'string'){
            return  func(obj);
        }
        else if(typeof obj == 'object'){
            var rstr = "";
            for(var key in obj){
                // 嵌套的obj，直接stringify
                if(typeof obj[key] == 'object'){
                    rstr += key + "=" + func(JSON.stringify(obj[key])) + "&";
                }else if(typeof obj[key] == 'string'){
                    rstr += key + "=" + func(obj[key]) + "&";
                }
                // 其他的不管
            }
            return rstr.substr(0,rstr.length-1);
        }
        else{ // other
            return obj + "";
        }
    };
})(jQuery);
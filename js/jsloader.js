/*! LAB.js (LABjs :: Loading And Blocking JavaScript)
 v2.0.3 (c) Kyle Simpson
 MIT License
 */
(function(o){var K=o.$LAB,y="UseLocalXHR",z="AlwaysPreserveOrder",u="AllowDuplicates",A="CacheBust",B="BasePath",C=/^[^?#]*\//.exec(location.href)[0],D=/^\w+\:\/\/\/?[^\/]+/.exec(C)[0],i=document.head||document.getElementsByTagName("head"),L=(o.opera&&Object.prototype.toString.call(o.opera)=="[object Opera]")||("MozAppearance"in document.documentElement.style),q=document.createElement("script"),E=typeof q.preload=="boolean",r=E||(q.readyState&&q.readyState=="uninitialized"),F=!r&&q.async===true,M=!r&&!F&&!L;function G(a){return Object.prototype.toString.call(a)=="[object Function]"}function H(a){return Object.prototype.toString.call(a)=="[object Array]"}function N(a,c){var b=/^\w+\:\/\//;if(/^\/\/\/?/.test(a)){a=location.protocol+a}else if(!b.test(a)&&a.charAt(0)!="/"){a=(c||"")+a}return b.test(a)?a:((a.charAt(0)=="/"?D:C)+a)}function s(a,c){for(var b in a){if(a.hasOwnProperty(b)){c[b]=a[b]}}return c}function O(a){var c=false;for(var b=0;b<a.scripts.length;b++){if(a.scripts[b].ready&&a.scripts[b].exec_trigger){c=true;a.scripts[b].exec_trigger();a.scripts[b].exec_trigger=null}}return c}function t(a,c,b,d){a.onload=a.onreadystatechange=function(){if((a.readyState&&a.readyState!="complete"&&a.readyState!="loaded")||c[b])return;a.onload=a.onreadystatechange=null;d()}}function I(a){a.ready=a.finished=true;for(var c=0;c<a.finished_listeners.length;c++){a.finished_listeners[c]()}a.ready_listeners=[];a.finished_listeners=[]}function P(d,f,e,g,h){setTimeout(function(){var a,c=f.real_src,b;if("item"in i){if(!i[0]){setTimeout(arguments.callee,25);return}i=i[0]}a=document.createElement("script");if(f.type)a.type=f.type;if(f.charset)a.charset=f.charset;if(h){if(r){e.elem=a;if(E){a.preload=true;a.onpreload=g}else{a.onreadystatechange=function(){if(a.readyState=="loaded")g()}}a.src=c}else if(h&&c.indexOf(D)==0&&d[y]){b=new XMLHttpRequest();b.onreadystatechange=function(){if(b.readyState==4){b.onreadystatechange=function(){};e.text=b.responseText+"\n//@ sourceURL="+c;g()}};b.open("GET",c);b.send()}else{a.type="text/cache-script";t(a,e,"ready",function(){i.removeChild(a);g()});a.src=c;i.insertBefore(a,i.firstChild)}}else if(F){a.async=false;t(a,e,"finished",g);a.src=c;i.insertBefore(a,i.firstChild)}else{t(a,e,"finished",g);a.src=c;i.insertBefore(a,i.firstChild)}},0)}function J(){var l={},Q=r||M,n=[],p={},m;l[y]=true;l[z]=false;l[u]=false;l[A]=false;l[B]="";function R(a,c,b){var d;function f(){if(d!=null){d=null;I(b)}}if(p[c.src].finished)return;if(!a[u])p[c.src].finished=true;d=b.elem||document.createElement("script");if(c.type)d.type=c.type;if(c.charset)d.charset=c.charset;t(d,b,"finished",f);if(b.elem){b.elem=null}else if(b.text){d.onload=d.onreadystatechange=null;d.text=b.text}else{d.src=c.real_src}i.insertBefore(d,i.firstChild);if(b.text){f()}}function S(c,b,d,f){var e,g,h=function(){b.ready_cb(b,function(){R(c,b,e)})},j=function(){b.finished_cb(b,d)};b.src=N(b.src,c[B]);b.real_src=b.src+(c[A]?((/\?.*$/.test(b.src)?"&_":"?_")+~~(Math.random()*1E9)+"="):"");if(!p[b.src])p[b.src]={items:[],finished:false};g=p[b.src].items;if(c[u]||g.length==0){e=g[g.length]={ready:false,finished:false,ready_listeners:[h],finished_listeners:[j]};P(c,b,e,((f)?function(){e.ready=true;for(var a=0;a<e.ready_listeners.length;a++){e.ready_listeners[a]()}e.ready_listeners=[]}:function(){I(e)}),f)}else{e=g[0];if(e.finished){j()}else{e.finished_listeners.push(j)}}}function v(){var e,g=s(l,{}),h=[],j=0,w=false,k;function T(a,c){a.ready=true;a.exec_trigger=c;x()}function U(a,c){a.ready=a.finished=true;a.exec_trigger=null;for(var b=0;b<c.scripts.length;b++){if(!c.scripts[b].finished)return}c.finished=true;x()}function x(){while(j<h.length){if(G(h[j])){try{h[j++]()}catch(err){}continue}else if(!h[j].finished){if(O(h[j]))continue;break}j++}if(j==h.length){w=false;k=false}}function V(){if(!k||!k.scripts){h.push(k={scripts:[],finished:true})}}e={script:function(){for(var f=0;f<arguments.length;f++){(function(a,c){var b;if(!H(a)){c=[a]}for(var d=0;d<c.length;d++){V();a=c[d];if(G(a))a=a();if(!a)continue;if(H(a)){b=[].slice.call(a);b.unshift(d,1);[].splice.apply(c,b);d--;continue}if(typeof a=="string")a={src:a};a=s(a,{ready:false,ready_cb:T,finished:false,finished_cb:U});k.finished=false;k.scripts.push(a);S(g,a,k,(Q&&w));w=true;if(g[z])e.wait()}})(arguments[f],arguments[f])}return e},wait:function(){if(arguments.length>0){for(var a=0;a<arguments.length;a++){h.push(arguments[a])}k=h[h.length-1]}else k=false;x();return e}};return{script:e.script,wait:e.wait,setOptions:function(a){s(a,g);return e}}}m={setGlobalDefaults:function(a){s(a,l);return m},setOptions:function(){return v().setOptions.apply(null,arguments)},script:function(){return v().script.apply(null,arguments)},wait:function(){return v().wait.apply(null,arguments)},queueScript:function(){n[n.length]={type:"script",args:[].slice.call(arguments)};return m},queueWait:function(){n[n.length]={type:"wait",args:[].slice.call(arguments)};return m},runQueue:function(){var a=m,c=n.length,b=c,d;for(;--b>=0;){d=n.shift();a=a[d.type].apply(null,d.args)}return a},noConflict:function(){o.$LAB=K;return m},sandbox:function(){return J()}};return m}o.$LAB=J();(function(a,c,b){if(document.readyState==null&&document[a]){document.readyState="loading";document[a](c,b=function(){document.removeEventListener(c,b,false);document.readyState="complete"},false)}})("addEventListener","DOMContentLoaded")})(this);

/**
 * Created by akang on 14-1-17.
 */
(function(){
// 支持多个目录，注意文件顺序，依赖关系按照 resource object 的先后顺序定
    var _scripts = [{ // 01
        path2Dir : "./",
        files : ["lib/jquery-2.0.3.min.js","lib/jquery-ui.min.js",
            "lib/template-simple.js"
        ,"pmuConstant.js","lib/jquery.xml2json.js","nav.js"]
    },{ // 02
        path2Dir : "./",
        files : ["config.js",
            "storageObjects.js","util.js","utils.js","pmu.util.js","trapdoor.js","alertbox02.js","util/common.js","util/ui.js","jquery.widget.min.js"
        ]
    }];

    var _csses = [{
        path2Dir : "../css",
        files : ["alertbox02.css"]
    }];
    
    
    
    function loadAssets(){
//    hideBodyCSS();
        for( var i = 0 ; i < _csses.length; i++){
            loadCsses(_csses[i].files,_csses[i].path2Dir);
        }
        for( var j = 0 ; j < _scripts.length; j++){
            loadScripts(_scripts[j].files,_scripts[j].path2Dir);
        }
    }

// 添加隐藏body的style
    function hideBodyCSS(){
        var s = document.createElement("style");
        s.innerHTML = "body{display:none;}";
        s.id = "hide_body_style_node";
        document.head.appendChild(s);
        console.log("jsloader: hide body");
    }

    function showBodyCss(){
        var node = document.getElementById("hide_body_style_node");
        node.parentNode.removeChild(node);
    }

// 将这个文件中定义的相对于本文件的path2Dir，转换为绝对路径
    function relative2AbsForThis(){
        var pathAA = "";
        for( var i = 0 ; i < _csses.length; i++){
            pathAA = _csses[i].path2Dir;
            if(pathAA){
                pathAA = relative2Abs(pathAA, _this_file_path_);
                pathAA = checkPathSlash(pathAA);
                _csses[i].path2Dir = pathAA;
            }
        }
        for( var j = 0 ; j < _scripts.length; j++){
            pathAA = _scripts[j].path2Dir;
            if(pathAA){
                pathAA = relative2Abs(pathAA, _this_file_path_);
                pathAA = checkPathSlash(pathAA);
                _scripts[j].path2Dir = pathAA;
            }
        }
    }

// path2Dir: base path to the script dir
    function loadScripts(files, path2Dir){
        path2Dir = path2Dir || "";
        // 设置每个脚本之间等待// 并且并行下载后循序执行 -- noap
//    var lab = $LAB.setOptions({AlwaysPreserveOrder:true});
        if(typeof (JSON) == 'undefined'){// IE 10
            _scripts[0].files.push("lib/json2.js");
        }

        for(var i = 0 ; i < files.length; i++){
            if(files[i]) files[i] = path2Dir + files[i];
            document.write('<script type="text/javascript" src="'+ files[i] + '"></script>');
        }
//    return labObj.script(files);
    }


// path2Dir: base path to the css dir
    function loadCsses(files, path2Dir){
        path2Dir = path2Dir || "";
        for(var i = 0 ; i < files.length; i++){
//        if(files[i]) JSLoader.loadStyleSheet( path2Dir + files[i]);
            if(files[i]) loadCss(path2Dir + files[i]);
        }
    }

    function loadCss(path){
//    document.write('<link rel="stylesheet/dynamic" type="text/css" href="' + path + '">')
        /*JavaScript动态加载Css文件*/
        var cssNode = document.createElement('link');
        cssNode.rel = 'stylesheet';
        cssNode.type = 'text/css';
        cssNode.href = path;
//    cssNode.href = 'style.css?t='+new Date().getTime();/*附带时间参数，防止缓存*/
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(cssNode);
    }

// ******************* 路径帮助

    /**
     * 如果路径最后没有"/",则添加
     * @param uri
     * @returns {Array}
     */
    function checkPathSlash(path){
        if(path){
            if(path.substr(path.length-1,1) != "/") path += "/";
        }
        return path;
    }


    /**
     * 获取 URI 片段
     * @return  {Array}
     */
    function getURIPathSegments( uri ) {
        var segements = uri.split( "\/" );
//            if(uri.substr(uri.length-1,1) != "/")
        segements.pop(); // 弹出最后的文件名
        return segements;
    }

    /**
     * 获取指定文件所在的目录 URI
     *
     * @private
     * @method  dirname
     * @param   uri {String}
     * @return  {String}
     */
    function dirname( uri ) {
        return uri.match( /[^?#]*\// )[0];
    }

    /**
     * 将相对路径转换为绝对路径
     *
     * @private
     * @method  relative2Abs
     * @param   relative_uri {String}   指定文件的相对路径
     * @param   base_uri {String}       基于的 uri
     * @return  {String}
     */
    function relative2Abs( relative_uri, base_uri ) {
    	if(relative_uri.charAt(0) == "/")  return relative_uri;
        var dotPath = relative_uri.match( /(\.{1,2}\/)+/ )[0];
        var dotSegments = getURIPathSegments( dotPath );

        if ( base_uri === undefined ) {
            base_uri = dirname( currentScriptPath() );
        }

        var segements = getURIPathSegments( base_uri );

        if ( dotPath !== "\.\/" ) {
            for ( var i = 0; i < dotSegments.length; i++ ) {
                segements.pop();
            }
        }

        return segements.join("\/") + "\/" + relative_uri.slice( relative_uri.indexOf(dotPath) + dotPath.length );
    }

//var _should_auto_load_ = null;

    // 获取当前文件绝对路径
    function getAbsolutePath() {
//        var src = $("script[src$='jsloader.js']").attr("src");

        var scripts = document.getElementsByTagName('script');
        var script = null;
        var len = scripts.length;

        for(var i = 0; i < scripts.length; i++) {
            if(scripts[i].src.indexOf(_file_name_) != -1) {
                script = scripts[i];
                break;
            }
        }
        if(!script) return;

//        _should_auto_load_ = script.dataset.auto;
        var src = script.getAttribute("src") //script.src is absolute path
        // 不是绝对路径需要修正
        if(src.indexOf("http://") != 0 && src.indexOf("/") != 0){
            var url = window.location.pathname;
            var index = url.indexOf("?");
            if(index != -1){
                url = url.substring(0, index-1);
            }
            src = relative2Abs(src,url);
        }
        return src;
    }

    // 扫描html中的script 标签，查看是否有需要加入
    function scanHtmlScripts(){
        var ss = document.getElementsByTagName("script")
        for(var i = 0 ; i < ss.length ; i++){
            if(ss[i].getAttribute("data-list")){
                var obj = {path2Dir : ss[i].getAttribute("data-dir")};
                obj.files = ss[i].getAttribute("data-list").split(";");
                loader.addScripts(obj);
            }
        }
    }
    // 扫描html中的script 标签，查看是否有需要
    function scanHtmlCsses(){
        var ss = document.getElementsByTagName("link");
        for(var i = 0 ; i < ss.length ; i++){
            if(ss[i].getAttribute("data-list")){
                var obj = {path2Dir : ss[i].getAttribute("data-dir")};
                obj.files = ss[i].getAttribute("data-list").split(";");
                loader.addCsses(obj);
            }
        }
    }

// *******************


// *******************
    window.PMU = window.PMU || {};
    window.PMU.utils = window.PMU.utils || {};
    window.PMU.utils.Loader = {};
    var loader = window.PMU.utils.Loader;
    loader.addScripts = function(scripts){ // 添加一个目录下的指定script -- {path2Dir : "" , files : ""}
        if(scripts.path2Dir){
            scripts.path2Dir = relative2Abs(scripts.path2Dir, window.location.pathname);
            scripts.path2Dir = checkPathSlash(scripts.path2Dir);
        }
        _scripts.push(scripts);
    }
    loader.addCsses = function(csses){ // 添加一个目录下的指定script
        if(csses.path2Dir){
            csses.path2Dir = relative2Abs(csses.path2Dir, window.location.pathname);
            csses.path2Dir = checkPathSlash(csses.path2Dir);
        }
        _csses.push(csses);
    }
    loader.loadAssets = function(){
        loadAssets();
    }
// 将相对于jsloader的相对路径转换成绝对路径
    loader.relateThis2Abs = function(relative_path){
        return relative2Abs(relative_path, _this_file_path_);
    };
//    loadAssets(); // 必须先运行上面两句代码，scripts和csses才有定义
// *******************

// ****************** 初始化
//假设文件名为load.js
    var _file_name_ = "jsloader.js";
    var _this_file_path_ = dirname(getAbsolutePath());
//console.log(_this_file_path_);
    relative2AbsForThis();
    scanHtmlScripts();
//    scanHtmlCsses();
//    if(_should_auto_load_ == null || _should_auto_load_){
    loadAssets();  // default auto load
//    }
})();
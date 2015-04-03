/**
 * Created by akang on 14-8-29.
 */
(function(){
    window.PMU = window.PMU || {};
    PMU.nav = {
        setHash : function(path){
            if(!path){
                console.log("ERROR: set null hash");
                if(PMU.CONFIG.DEBUG){
                    PMU.utils.printStack();
                }
                return;
            }
            window.location.hash = path;  // path startWith a '#' is ok
        },getHash : function(){
            // 取出hash，不包含？
            var hash = window.location.hash.substr(1);
            var i = hash.indexOf("?");
            if(i != -1)
                hash = hash.substring(0,i);  // the index of first ?  // 取出相对于基页面的相对地址
            return hash;
        },setAjaxHash : function(path){
            if(path) path = "!" + path;
            this.setHash(path);
        },getAjaxHash: function(){
            var hash = this.getHash();
            if(hash) {
                if(hash.charAt(0) == "!") hash = hash.substr(1);
                else hash = null;
            }
            return hash;
        },history : {
            _historyStack : [],  // 记录加载历史，historyStack栈顶标识当前显示页面的hash
            length : function(){
                return this._historyStack.length;
            },peek : function(){
                return this._historyStack[this._historyStack.length-1];
            },pop : function(n){
                var r = null;
                if(typeof n != 'number'){
                    r = this._historyStack.pop();
		}
                else{
                    r = this._historyStack.splice(this._historyStack.length-n); // 回退指定页数
		    r = r[0];
		}
		
                if(!r || r.length == 0){
                    console.log("ERROR: history EMPTY");
                    if(PMU.CONFIG.DEBUG){
                        PMU.utils.printStack();
                    }
                }
                return r;
            },push : function(hash){
                return this._historyStack.push(hash);
            },reset : function(){
                this._historyStack = [];
            }
        },addInterceptor : function(inteceptor){
            // hash change 时的 预处理器 或者 拦截器
            if(typeof inteceptor == 'function') this._interceptors.push(inteceptor);
        },_interceptors : []
        ,interceptor : function(hash){
            var flag = false;
            for(var i = 0 ; i < this._interceptors.length; i++){
                if(this._interceptors[i](hash) == true) {
                    flag = true;
                    break;
                }
            }
            return flag;
        }
    };
})();
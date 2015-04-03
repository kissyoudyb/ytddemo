/**
 * Created by akang on 14-2-12.
 */
// 存储持久化类

(function(){
    var _userId = null;
    function getUserId(){
        if(_userId) return _userId;
        else{
            _userId = (Manager.getLightInfo() || {id:null}).id;
            return _userId;
        }
    }

    // 辅助函数 , 为了能够让多用户使用，localStorage保存的内容的key需要添加用户id后缀，sessionStorage不需要
    // notUser : boolean 指示是否不使用用户编号后缀，为true不添加，默认要添加的,为false则添加
    function localSave(key,obj,notUser){
        if(notUser !== true && getUserId()){ // 默认要添加用户编号后缀
            key += "_"+getUserId();
        }
        if(typeof obj  == "object")
            localStorage.setItem(key, JSON.stringify(obj));
        else
            localStorage.setItem(key, obj);
    }
    function localGet(key,isJSON,notUser){
        if(notUser !== true && getUserId()){ // 默认要添加用户编号后缀
            key += "_"+getUserId();
        }
        var str = localStorage.getItem(key);
        if(str){
            if(isJSON) return JSON.parse(str);
            else return str;
        }
        else return null;
    }
    function localRemove(key,notUser){
        if(notUser !== true && getUserId()){ // 默认要添加用户编号后缀
            key += "_"+getUserId();
        }
        localStorage.removeItem(key);
    }

    function sessionSave(key,obj){
        if(typeof obj  == "object")
            sessionStorage.setItem(key, JSON.stringify(obj));
        else
            sessionStorage.setItem(key, obj);
    }
    function sessionGet(key,isJSON){
        var str = sessionStorage.getItem(key);
        if(str){
            if(isJSON) return JSON.parse(str);
            else return str;
        }
        else return null;
    }
    function sessionRemove(key){
        sessionStorage.removeItem(key);
    }
    function sessionClear(){
        sessionStorage.clear();
    }

    // 外设服务持久化存储
    function netStorageSave(key,value){

    }

// ----------
    if(!window.PMU) window.PMU = {};
    if(!window.PMU.Storage) window.PMU.Storage = {};
// ----------

    PMU.Storage.localSave = localSave;
    PMU.Storage.localGet = localGet;
    PMU.Storage.localRemove = localRemove;
    PMU.Storage.sessionSave = sessionSave;
    PMU.Storage.sessionGet = sessionGet;
    PMU.Storage.sessionRemove = sessionRemove;
    PMU.Storage.sessionClear = sessionClear;

//

    // ++++++++++++++ 网点信息存储类 ++++++++++++++
    var Siteinfo = {};

    Siteinfo.key = "_site_info_store_";
    Siteinfo.save = function(obj){
        localSave(Siteinfo.key,obj,true);
    };
    Siteinfo.get = function(){
        return localGet(Siteinfo.key,true,true);
    };
    Siteinfo.clear = function(){
        localRemove(Siteinfo.key,true);
    };
    var _orgCode = null;  // 内存缓存,登出时清空
    Siteinfo.getOrgCode = function(){
        if(_orgCode) return _orgCode;
        else{
            _orgCode = (Siteinfo.get() || {orgCode:null}).orgCode;
            return _orgCode;
        }
    };
    window.PMU.Storage.Siteinfo = Siteinfo;// 暴露给外界

    // 安全节点号
    window.PMU.Storage.SecNode = {key: "_sec_node_num_"};
    window.PMU.Storage.SecNode.save = function(str){
        PMU.constants.secNodeId = str;  // 更新默认安全节点号
        sessionSave(window.PMU.Storage.SecNode.key,str);
    };
    window.PMU.Storage.SecNode.get = function(){
        var str = sessionGet(window.PMU.Storage.SecNode.key);
        if(!str) str = window.PMU.constants.secNodeId;// 如果不存在，采用默认值
        return str;
    };

    // 网页版本存储
    window.PMU.Storage.Webversion = { key : "_web_version_"};
    window.PMU.Storage.Webversion.save = function(str){
        localSave(window.PMU.Storage.Webversion.key,str);
    };
    window.PMU.Storage.Webversion.get = function(){
        return localGet(window.PMU.Storage.Webversion.key);
    };

    window.PMU.Storage.Device = {key : "_device_info_", macKey : "_device_info_mac_"};
    window.PMU.Storage.Device.queryMac = function(success,failure){ // query 外设服务
        PMU.Commu.Device.queryWifiMacAddress({success:function(data){
            if(data.success) {
                localSave(this.macKey,data.result,true);
                if(success) success(data.result);
            }else{
                if(failure) failure(data);
            }
        }});
    };
    window.PMU.Storage.Device.getMac = function(){ // query localStorage
        return localGet(this.macKey);
    };


    // ++++++++++++++ 经理 ++++++++++++++
    var Manager = {};

    Manager.key = "_manager_store_full_";
    Manager.keyPre = "_manager_store_pre_";
    Manager.keyLightInfo = "_manager_store_light_info_";
    Manager.keyList = "_manager_store_success_list_";
    Manager.bindInfo = "_manager_bind_info_";
    Manager.saveFull = function(obj){
        sessionSave(Manager.key,obj);
    };
    Manager.getFull = function(){
        return sessionGet(Manager.key,true);
    };
    Manager.save = function(obj){
        Manager.saveLightInfo(obj);
    };
    Manager.get = function(){
        return Manager.getLightInfo();
    };
    Manager.clear = function(){
        sessionClear();  // 清空session ************
        _orgCode = null;
        _userId = null;
    };
    // 存储简易登陆信息 {id: "71386752", name: "韦明毅", orgCode: "456000000", password: "6daeca4903a..."}
    Manager.saveLightInfo = function(obj){  // name , id , password
        sessionSave(Manager.keyLightInfo,obj);
    };
    Manager.getLightInfo = function(){
        return sessionGet(Manager.keyLightInfo,true);
    };
    Manager.addLightInfo = function(obj){  // name , id , password
        var o = Manager.getLightInfo();
        $.extend(o,obj);
        Manager.saveLightInfo(o);
    };
    Manager.saveToSuccessList = function(id){
        if(!id) return;
        var list = Manager.getSuccessList();
        
        if(!list) list = [];
        // 寻找一样的ID，如果有则删除
        for(var i = 0 ; i < list.length ; i++){
            if(list[i] == id || list[i] == null){
                list.splice(i,1);
            }
        }

        // 添加到头，超过三个删除队尾的
        list.splice(0,0,id);
        if(list.length > 3){ // 只保存最近三个
            list.pop();
        }
        localSave(Manager.keyList, JSON.stringify(list),true);
    };
    Manager.getSuccessList = function(){
        return localGet(Manager.keyList,true,true);
    };
    Manager.savePre = function(obj){ // 预填单机会需要，持久化大堂经理的用户编号与密码密文
        localSave(Manager.keyPre,obj,true);
    };
    Manager.getPre = function(){
        return localGet(Manager.keyPre,true,true);
    };
    Manager.clearPre = function(){
        localRemove(Manager.keyPre,true);
    };
    Manager.isLogined = function(){
        return !!Manager.getLightInfo();
    };
    Manager.setBindInfo = function(obj){
        if(obj == null) localRemove(Manager.bindInfo,true);
        else localSave(Manager.bindInfo,obj,true);
    };
    Manager.getBindInfo = function(){
        return localGet(Manager.bindInfo,true,true);
    };
    Manager.saveRemindRecommends = function(arr){
        PMU.Storage.localSave('_manage_remind_recommends_',arr);
    };
    Manager.getRemindRecommends = function(){
        return localGet('_manage_remind_recommends_',true);
    };
    window.PMU.Storage.Manager = Manager;// 暴露给外界
    PMU.Storage.Manager.getUserId = getUserId;

    // ++++++++++++++ 版本信息 ++++++++++++++
    var versionInfo = {};
    versionInfo.key = "_version_info_";
    versionInfo.keyFull = "_version_info_full_";
    // {"appver":"1.1.1.1","apptype":"corp"}
    // 优先从网址中取得版本信息，并存入localStorage, 并返回版本信息，
    // 如果没有，则从localStrorage里面取,因为考虑到用户登出时要清空session
    versionInfo.getAndStore = function(){
        var params = PMU.utils.getUrlParams();
        if(params && params.apptype && params.appver) {
            localSave(versionInfo.key, params,true);
            return params;
        }

        var vi = localGet(versionInfo.key,true,true);
        if(vi) return vi;
    };
    versionInfo.set = function(obj){
        localSave(versionInfo.key,obj,true);
    };
    versionInfo.setFull = function(obj){
        localSave(versionInfo.keyFull,obj,true);
    };

    // /ecpweb/ecpJson.action?_fw_service_id=validateVersionService&jsonData={"padappversion" :"1.0.0.90"}
    // {"canDownload":true,"errorCode":"0","message":"usable version","needInfo":"0"}
    versionInfo.query = function(options){
        var opt = {
            _fw_service_id : "validateVersionService",
            jsonData : {
                'padappversion': versionInfo.getAndStore().appver
                ,'apptype' : options.apptype
            }
        };
        if(options.complete) opt.complete = options.complete;
        opt.success = function(data){
            if(options.success) options.success(data);
            if(parseInt(data.errorCode) == 0){
                var vi = localGet(versionInfo.key,true,true) || {};
                vi = $.extend(vi,data);
                delete vi.errorCode;
                delete vi.canDownload;
                delete vi.needInfo;
                delete vi.message;
//                $.extend(vi,Page_home_entrance.DeviceInfo);
                localSave(versionInfo.keyFull, vi,true);
            }
        };
        if(options.error) opt.error = options.error;
        PMU.Commu.ecpJson(opt);
    };
    versionInfo.querySimu = function(options){
//        errorcode的含义
//        0：代表版本验证通过
//        1：代表传入版本信息不是"0.0.0.0"格式或者版本低于最低可运行版本
//        2：代表版本信息部合法，还有非数字字符。

        options.success({
                "canDownload":true,
                "errorCode":"0",
                "message":"当前版本不可用，最低可用版本为：1.0.0.74,请到应用商店更新！",
                "needInfo":"0"
        });
    };
    // 从storage里面取
    versionInfo.getFull = function(){
        return localGet(versionInfo.keyFull,true,true);
    };
    window.PMU.Storage.VersionInfo = versionInfo;   // 登陆以后，版本等信息都以这个为准
    // 外设服务存储
    PMU.Storage.Device = {key:"_device_info__"};
    PMU.Storage.Device.loginInfoKey = "DeviceStorageLoginInfo";
    PMU.Storage.Device.versionInfoKey = "DeviceStorageVersionInfo";
    PMU.Storage.Device.statusKey = "_device_status_info_";
    // 查询，并存储在本地， 用同步吧，就这一次
    PMU.Storage.Device.queryDeviceLoginInfo  = function(/*callbacks*/){
        var result = null;
//        result = sessionGet(PMU.Storage.Device.loginInfoKey,true);
//        if(result) return result;
        var date = new Date();
        result = PMU.Storage.Device.getSync(PMU.Storage.Device.loginInfoKey);
        if(!result) return null;
//        sessionSave(PMU.Storage.Device.loginInfoKey,result);
        console.info("queryDeviceLoginInfo use time:" + ((new Date()).getTime() - date.getTime()));
        if(result.session){
            for(var key in result.session){
                var v = result.session[key];
                if(typeof v == 'object') v = JSON.stringify(v);
                sessionStorage[key] = v;
            }
        }

        if(result.local){
            for(var key in result.local){
                var v = result.local[key];
                if(typeof v == 'object') v = JSON.stringify(v);
                localStorage[key] = v;
            }
        }
        console.info("queryDeviceLoginInfo after store use time:" + ((new Date()).getTime() - date.getTime()));
//        PMU.Storage.VersionInfo.setFull(result.versionInfo);
//        PMU.Storage.Siteinfo.save(result.siteInfo);
//        PMU.Storage.Manager.saveLightInfo(result.userInfo);
//        PMU.Storage.Device.saveLocal(result.deviceInfo);
//        PMU.Storage.Manager.saveFull(result.loginData);
        return result;
    };
    PMU.Storage.Device.deleteDeviceLoginInfo = function(){
        var flag = false;
        PMU.Commu.Device.Storage.deleteStorageKey(PMU.Storage.Device.loginInfoKey,{
            async : false,
            timeout : 2000,
            success : function(data){
                if(data.success == true) flag = true;
            }
        });
        return flag;
    };
    PMU.Storage.Device.statusSave = function(obj){
        return localSave(PMU.Storage.Device.statusKey,obj,true);
    };
    PMU.Storage.Device.statusGet = function(){
        return localGet(PMU.Storage.Device.statusKey,true,true);
    };
    PMU.Storage.Device.setSync = function(key,obj){
        var res = false;
        PMU.Commu.Device.Storage.setStorageValue(key,obj,{
            async : false,
            timeout : 2000,
            success : function(data){
                res = result.success;
            }
        });
        return res;
    };
    PMU.Storage.Device.getSync = function(key){
        var res = null;
        PMU.Commu.Device.Storage.getStorageValue(key,{
            async : false,
            timeout : 2000,
            success : function(data){
                if(data.success === false) return;
                res = data;
            }
        },true);
        return res;
    };
    PMU.Storage.Device.deleteSync = function(key){
        var flag = false;
        PMU.Commu.Device.Storage.deleteStorageKey(key,{
            async : false,
            timeout : 2000,
            success : function(data){
                if(data.success == true) flag = true;
            }
        });
        return flag;
    };
    PMU.Storage.Device.saveLocal = function(obj){
        localSave(this.key,obj,true);
    };
    PMU.Storage.Device.getLocal = function(){
        return localGet(this.key,true,true);
    };
    PMU.Storage.Device.remove = function(){
        localRemove(this.key,true);
    };
    /**
     * 将所有的localStorage、sessionStorage存储到外设服务，使得跨域之后仍然能够取得
     */
    PMU.Storage.saveThisToDevice = function(success){
        // *** var s =""; for(var key in localStorage) s+='"'+key+'",'; console.log(s);
        // 准备要存储的数据，将当前域下所有的存储信息都带到下一个域去
        var localKey = ["_device_info__","_manager_store_pre_","_manager_bind_info_","_manager_store_success_list_","_site_info_store_","_version_info_","_version_info_full_"];
        var sessionKey = ["_manager_store_full_","_manager_store_light_info_","_sec_node_num_"];
        var data = {
            "local":{},
            "session":{}
        };
        var value = null;
        for(var i = 0 ; i < localKey.length ; i++){
            value = localStorage.getItem(localKey[i]);
            if(value) data.local[localKey[i]] = value;
    }
        for(i = 0 ; i < sessionKey.length ; i++){
            value = sessionStorage.getItem(sessionKey[i]);
            if(value) data.session[sessionKey[i]] = value;
        }
        PMU.Commu.Device.Storage.setStorageValue("DeviceStorageLoginInfo",data,{
            success: success,
            failure:function(){
                PageManager.showLoginError("存储基础信息失败！");
            }
        });
    };
    PMU.Storage.restoreThisFromDevice = function(success){
        PMU.Commu.Device.Storage.getStorageValue("DeviceStorageLoginInfo",{
            success: function(data){
                for(var key in data.local){
                    localStorage.setItem(key,data.local[key]);
                }
                for(var key in data.session){
                    sessionStorage.setItem(key,data.session[key]);
                }
                if(success) success(data);
            },fail:function(){
                PageManager.showLoginError("存储基础信息失败！");
            }
        });
    };
    // 获取设备编号，只保存在内存中，保证新进入，新加载一次
    PMU.Storage.Device.Eqmt_ID = null;
    PMU.Storage.Device.getEqmt_ID = function(){
        // 先去本地查询
        if(PMU.Storage.Device.Eqmt_ID) {
            return PMU.Storage.Device.Eqmt_ID;
        }
        // 如果本地没有，再去外设服务查询，并存本地
        var key = "Preorder_Eqmt_ID";
        var v = null;
        PMU.Commu.Device.Storage.getStorageValue(key,{
            success : function(data){
                v = data;
            },fail : function(data){
            }
        },true);
        if(!v) return null;
        PMU.Storage.Device.Eqmt_ID = v;
        return PMU.Storage.Device.Eqmt_ID;
    };
    PMU.Storage.Device.deleteEqmt_ID = function(){
        var key = "Preorder_Eqmt_ID";
        PMU.Storage.Device.Eqmt_ID = null;
        var v = false;
        PMU.Commu.Device.Storage.deleteStorageKey("Preorder_Eqmt_ID",{
            success:function(){
                v = true;
            },error:function(){}
        },true);
        return v;
    };
    PMU.Storage.App = {};
    PMU.Storage.App.apptype = null;
    PMU.Storage.App.getApptype = function(){
        if(PMU.Storage.App.apptype) return PMU.Storage.App.apptype;
        var type = null;
        var info = PMU.Storage.Manager.getLightInfo();
        if(info) type = info.apptype;
        if(!type) {
            info = PMU.Storage.VersionInfo.getFull();
            if(info) type = info.apptype;
        }
        if(!type) return null;
        PMU.Storage.App.apptype = type.toLowerCase();
        return type;
    };
    PMU.Storage.App.isPreorder = function(){
        return PMU.Storage.App.getApptype() == PMU.constants.APP_TYPE.PREORDER;
    };
    PMU.Storage.App.isKohen = function(){
        return PMU.Storage.App.getApptype() == PMU.constants.APP_TYPE.KOHEN;
    };
    PMU.Storage.App.isCorp = function(){
        return PMU.Storage.App.getApptype() == PMU.constants.APP_TYPE.CORP;
    }
})();
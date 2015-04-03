/**
 * Created by akang on 14-3-19.
 *  说明:PMU框架的配置信息以及常量
 *
 */
(function(){

    window.PMU = window.PMU || {};
    // PMU需要使用的常量
    window.PMU.constants = {
        secNodeId : "102001",  // 安全节点号 -- 需要动态获取，生产102001，非生产402001

        // 是否将js错误弹出显示
        SHOW_JS_ERROR : false,
        // ajax请求超时时间,单位是毫秒
        AJAX_TIMEOUT : 15000,
        // 默认的ajax请求方式
        AJAX_METHOD : 'post',
        // 默认为非debug模式
        IS_DEBUG : false,
        // 默认的ajax数据格式
        AJAX_DATA_TYPE : 'json',
        // 默认后端请求Action
        DEFAULT_ACTION : 'ecpJsonDispatch.action',
        // 交易成功代码
        BK_CODE_SUCCESS : '00',

        // 直辖市代码
        AREA_BEIJING : 110000,
        AREA_TIANJING : 120000,
        AREA_SHANGHAI : 310000,
        AREA_CHONGQING : 500000,

        // 预填单
        PREORDER : {
            type_str : "preorder",
            login_path : "XX/preorder", // 存放路径，指向login页面，相对于域名
            domain : "",  // 存放域名
            port : "80",  // 端口
            index_path : "" // preorder首页，相对于登陆页面的路径
        },
        APP_TYPE : {
            PREORDER: "preorder",
            KOHEN: "kohen",
            CORP: "corp"
        },APP_TYPE_JS_LOG : {
            PREORDER: "1102",
            KOHEN: "1203",
            CORP: "1002"
        },INSURANCE : {
            CORP:{
                TXN_ITT_CHNL_CGY_CODE : "20230038", //对公渠道号
                TXN_ITT_CHNL_ID: "20230038"
            },KOHEN :{
                TXN_ITT_CHNL_CGY_CODE : "20220037", //大堂渠道号
                TXN_ITT_CHNL_ID: "20220037"
            },
            RELATIVEPATH:"bis/dayend/template/marketing",
            FILENAME4CACLFLAG:"INSPD-DataItem.txt",//产品试验标志文件名
            RELATIVEPATH4CACLFLAG:"bis/dayend/standardcode"//产品试验标志文件名路径
        },SERVER_ADDRESS : {
            PUBLIC : "http://www.public.com",
            MANAGE : "http://www.manage.com"
//            PUBLIC : PMU.utils.getHttpBase(),
//            MANAGE : PMU.utils.getHttpBase()
//            PUBLIC : "http://128.160.97.212:17002"
        },LOCAL_VISIT_KEY : '_add_visitinfo_cus_ids_'
        ,POSITION_ID : {
            LOBBY : 'G00000000008'
        },YTD_EXTRA : "preorder"
    }
    // 配置的默认函数实现
    // 也可以将应用的一些不怎么变化的配置信息在启动应用的时候存储在此
    window.PMU.configuration = {

        // ajax请求失败后的回调函数
//        ajaxFailure : function(fn) {
//            new PJF.ui.messageBox({
//                title : '错误',
//                content : '与后台通信发生错误',
//                fn : fn
//            });
//        },
//        ajaxParseError : function(fn) {
//            new PJF.ui.messageBox({
//                title : '错误',
//                content : '后台数据格式错误',
//                fn : fn
//            });
//        },
//        // ajax请求失败后的回调函数
//        ajaxTimeOut : function(fn) {
//            new PJF.ui.messageBox({
//                title : '服务超时',
//                content : '后台服务处理超时',
//                fn : fn
//            });
//        }
    }

})();
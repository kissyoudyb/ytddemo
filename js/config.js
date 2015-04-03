/**
 * Created by akang on 14-6-26.
 * 添加配置开关，免得一个功能启用与否要去改代码
 */
(function(){
    window.PMU = window.PMU || {};
    window.PMU.CONFIG = {
        // 是否开启ajax error时，调用壳去检测网络
        FIAL_NET_CHECK : false,
        // 是否开启对公平板 公共管理分流
        PUB_MAN_FLOW : false,
        // 是否允许使用 外设服务的 http代理1
        USE_HTTP_PROXY: true,
        // 是否开启壳palysound
        SHELL_PLAY_SOUND : false,
        // 是否开启call shell
        CALL_SHELL: true,
        // 是否开启position check
        POSITION_CHECK: false,
        // 是否开启debug
        DEBUG : true,
        // 是否开启 oc role check
        OC_ROLE_CHECK : true
    };

})();
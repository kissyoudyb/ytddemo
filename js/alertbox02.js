/**
 * Created by akang on 14-6-16.
 * 预填单机版本的alertbox，样式不同而已
 */
(function($){
    window.PMU = window.PMU || {};
    PMU.html = PMU.html || {};
    PMU.html.utils = PMU.html.utils || {};

    PMU.html.utils.alert = {
        template : '<div class="alertbox02-mask">' +
                        '<div class="pm-alertbox02">' +
                            '<div class="pm-alertbox02-title"></div>' +
                            '<div class="pm-alertbox02-content"></div>' +
                            '<div class="pm-alertbox02-buttons"></div>'+
                        '</div>' +
                    '</div>',
        btns : [{"title":"确定","class":"ok","handler":function(){this.close();}}]
    };
    PMU.html.utils.alert.show = function(msg,buttons,title,alertType){
    	if(!alertType)alertType="3";//默认样式
        var that = this;
        var t = that.template;
        if(alertType == "3"){
            t = that.template.replace(/2/g,alertType);
        }
        var opt = {
            template : t,
            message: msg || "",
            title : title || "",
            buttons: buttons || that.btns
        };

        if(that.mask){
            that.close();
            this.mask.empty();
        }

//        if(!that.mask || that.mask.alertType != alertType){
            that.mask = $(opt.template);
            that.mask.alertType = alertType;

            var titleClass = ".pm-alertbox02-title";
            var contentClass = ".pm-alertbox02-content";
            var btnsClass = ".pm-alertbox02-buttons";
            if(alertType == "3"){
                titleClass = titleClass.replace('2',alertType);
                contentClass = contentClass.replace('2',alertType);
                btnsClass = btnsClass.replace('2',alertType);
            }
            that.titleBox = that.mask.find(titleClass);
            that.contentBox = that.mask.find(contentClass);
            that.buttonBox = that.mask.find(btnsClass);
//        }

        var buttonClass = "'pm-button blue'";
        if(alertType == "3"){
            buttonClass = "'pm-button'";

            if(opt.buttons.length>=2){
                that.buttonBox.addClass("button2");
            }
        }

        that.titleBox.html(opt.title);
        that.contentBox.html(opt.message);
        if(opt.message.length < 20) that.contentBox.css("text-align","center");
        for(var i=0;i< opt.buttons.length;i++){
            var btn=$("<button class=" + buttonClass +"></button>").addClass(opt.buttons[i]["class"]);
            btn.html(opt.buttons[i].title);
            btn.data("hander",opt.buttons[i].handler);
//            btn.data("that",that);
            btn.mousedown(function(){
//                var tha = $(this).data("that");
                var h=$(this).data("hander");
                if($.isFunction(h)){
                    h.call(that);
                }
            });
            that.buttonBox.append(btn);
        }

        if(that.mask.parent().length == 0){
            that.mask.appendTo($(document.body));
        }
        that.mask.show();
    };

    PMU.html.utils.alert.clear = function(){
        this.buttonBox.empty();
        this.titleBox.empty();
        this.contentBox.empty();
    };

    PMU.html.utils.alert.close = function(){
        this.mask.hide();
        this.clear();
    };

})(jQuery);
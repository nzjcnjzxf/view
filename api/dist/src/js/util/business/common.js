var $ = require("jquery");
var request = require("request");
var config = require("util/config.js");
var pagination = require("lib/pagination.js");
var template = require("template");
var local = require("util/message.js").ch;
var userRouter = config.userRouter;
var pageSize = config.pageSize;
module.exports = (function () {
    /**退出登录 */
    function onQuitIcon () {
        $(".tc-icon").on("click", function () {
            $("#mask").html(
                template($("#alert-component").html(), {
                    showDefaultAlert: true,
                    type: "warn",
                    tipMsg: local.sureToLogout
                })
            );
            clickButton(
                function () {
                    location.href = "../app/login.html";
                    $.cookie('token', null);
                    $.cookie('userInfo', null);
                },
                function () { }
            );
        });
    }
    /**内容高度设置 */
    function setContentHeight () {
        $(".admin-content").css("height", $(document.body).height() - 53);
        $(window).resize(function () {
            $(".admin-content").css("height", $(document.body).height() - 53);
        });
    }
    /** 菜单大小显示切换*/
    function navChange () {
        var $container = $(".admin-container");
        $(".menu-icon").on("click", function () {
            var isShow = $container.hasClass("admin-container-mini");
            if (!isShow) {
                $container.addClass("admin-container-mini");
            } else {
                $container.removeClass("admin-container-mini");
            }
        });
    }

    /**菜单内容切换 */
    function navContentChange () {
        var $items = $(".admin-container .nav-item");
        var $contents = $(".admin-container .manage-content");
        $items.on("click", function () {
            var $index = $(this).index();
            $items
                .removeClass("active")
                .eq($index)
                .addClass("active");
            $contents
                .hide()
                .eq($index)
                .show();
            renderData($index);
        });
    }
    /**渲染表格 */
    function renderTable (cId, tId, data) {
        $("#" + cId).html(template($("#table-type-" + tId).html(), data));
    }

    /** 弹框按钮确定和取消*/
    function clickButton (success, cancel) {
        $("#mask .sure-btn").off();
        $("#mask .sure-btn").on("click", function () {
            success();
        });
        $("#mask .cancel-btn").off();
        $("#mask .cancel-btn").on("click", function () {
            $(".mask").hide();
            cancel();
        });
        $("#mask .alert-close").off();
        $("#mask .alert-close").on("click", function () {
            $(".mask").hide();
        });
    }

    // 删除二次提示
    function deleteTips (tipMsg, success, type, error) {
        $("#mask").html(
            template($("#alert-component").html(), {
                type: type || "error",
                tipMsg: tipMsg,
                showDefaultAlert: true
            })
        );
        clickButton(success, error);
    }

    /**
     * 我的弹框
     */
    function myAlert (tipMsg, custom) {
        $("#mask-alert").html(
            template($("#error-alert").html(), {
                tipMsg: tipMsg,
                custom: custom
            })
        );
        $("#mask-alert .sure-btn").on("click", function () {
            $("#mask-alert .mask").hide();
        });
    }
    /**
     * ie12才开始支持trim 方法，自定义trim
     * 去除前后空格
     * @param {trm} options
     */
    function myTrim (x) {
        return x.replace(/^\s+|\s+$/gm, "");
    }

    /**
     * 关于分页的注意事项
     *  添加分页步骤
     * 1、请求数据
     * 2、渲染表格
     * 3、添加分页
     * 4、添加事件监听
     * ** 注意要将请求分离出啦， 参数有调用者传递进去
     * 创建分页
     * options
     * @param {*} wrapId  容器id
     * @param {*} total  总共条数
     * @param {*} currentPage  当前页数
     * @param {*} callback  点击后的回调
     */
    function createPage (options) {
        // 创建分页
        var obj = {
            wrapid: options.wrapId, //页面显示分页器容器id
            total: options.total, //总条数
            pagesize: pageSize, //每页显示10条
            currentPage: options.currentPage, //当前页
            btnCount: 5, // 显示按钮最大的数目
            onPagechange: function (current) {
                options.callback(current);
            }
        };
        // 移除当前元素的所有事件
        $("#" + options.wrapId).off();
        pagination.init(obj);
        if (options.total > 0) {
            $("#" + options.wrapId).show();
        }
    }
    /**下拉选择添加事件 */
    function selectAddEvent (container, cb) {
        var $box = $("." + container + " .select-custom .select-box");
        var $text = $box.find(".text");
        var $selectBox = $box.find(".select-option");
        var $options = $box.find(".option");
        $box.off();
        $options.off();
        $box.on("click", function (event) {
            $selectBox.show();
            event.stopPropagation();
        });
        $options.on("click", function () {
            $text.text($(this).text());
            setTimeout(function () {
                $selectBox.hide();
            });
            if (cb) {
                cb($(this).index());
            }
        });
        $(document).on("click", function () {
            $selectBox.hide();
        });
    }
    /**科室信息的获取 */
    function getCenterInfo (centerInfo) {
        request.post(
            userRouter.queryCenterInfo,
            {},
            function (data) {
                centerInfo(data);
            },
            function (err) { }
        );
    }
    return {
        onQuitIcon: onQuitIcon,
        setContentHeight: setContentHeight,
        navChange: navChange,
        navContentChange: navContentChange,
        renderTable: renderTable,
        clickButton: clickButton,
        deleteTips: deleteTips,
        myAlert: myAlert,
        myTrim: myTrim,
        createPage: createPage,
        selectAddEvent: selectAddEvent,
        getCenterInfo: getCenterInfo
    };
})();

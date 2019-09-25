/**导入的模块 */
var commonMoudle = require('util/business/common.js')
var roleModule = require('util/business/role.js')
var personMoudle = require('util/business/person.js')
var oralModule = require('util/business/oral.js')

module.exports = (function ($) {
    /** 权限判断 */
    function checkAuth () {
        if (!hasAuth) {
            var $items = $(".admin-container .nav-item");
            var $contents = $(".admin-container .manage-content");
            $items
                .removeClass("active")
                .eq(1)
                .addClass("active");
            $contents
                .hide()
                .eq(1)
                .show();
            $(".sub-nav-item")
                .eq(0)
                .css("marginRight", 0);
            $(".no-auth").hide();
            oralModule.showPersonTable();
        } else {
            roleModule.showRoleSelect();
        }
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
    /**
     * 点击菜单后渲染数据
     * 当点击口语名词的时候 还原 oralCurrentIndex 的值为1  然后显示第一栏 个人的导航和内容
     * 当点击个人管理的时候 ，显示个人常用管理  隐藏新增个人常用管理
     */
    function renderData (i) {
        switch (i) {
            case 0:
                // 显示角色下拉框
                roleModule.showRoleSelect();
                break;
            case 1:
                // 还原 oralCurrentIndex 的值为1
                oralCurrentIndex = 1;
                var $subItems = $(".oral-manage-container .sub-nav-item");
                var $subContents = $(".oral-manage-container .sub-content");
                //  导航显示第一个
                $subItems
                    .removeClass("sub-nav-item-active")
                    .eq(0)
                    .addClass("sub-nav-item-active");
                //  内容显示第一个
                $subContents
                    .hide()
                    .eq(0)
                    .show();
                // 显示口语名词列表 隐藏新增内容
                $(".oral-content").show();
                $(".oral-content-add").hide();
                oralModule.showPersonTable();
                break;
            case 2:
                var $personFirst = $(".person-first"),
                    $personSecond = $(".person-second");
                $personFirst.show();
                $personSecond.hide();
                $(".person-first .search-value").val('');
                personMoudle.showpersonManageTable('');
                break;
            default:
                break;
        }
    }
    /**执行入口 */
    function init () {
        // 退出登录
        commonMoudle.onQuitIcon();
        // 权限判断
        checkAuth();
        // 显示角色和专科下拉框
        oralModule.specialtySelect();
        // 内容高度设置
        commonMoudle.setContentHeight();
        // 菜单大小显示切换
        commonMoudle.navChange();
        // 口语名词次级导航
        oralModule.subNavChange();
        // 个人常用管理
        personMoudle.personManage();
    }

    /**模块导出的方法 */
    return {
        init: init,
        navContentChange: navContentChange,
        clickButton: commonMoudle.clickButton,
        myAlert: commonMoudle.myAlert,
        selectAddEvent: commonMoudle.selectAddEvent,
        getCenterInfo: commonMoudle.getCenterInfo,
        refreshTable: oralModule.refreshTable
    };
})(require("jquery"));
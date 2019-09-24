var $ = require('jquery')
var request = require("request");
var config = require("util/config.js");
var pagination = require("lib/pagination.js");
var util = require('util/util.js');
var local = require('util/message.js').ch;
var olarRouter = config.olarRouter;
var codeRouter = config.codeRouter;
var smartRouter = config.smartRouter;
var userRouter = config.userRouter;
var currentOlarRouter = olarRouter.person;
var typeInput = util.typeInput;
var template = require("template");
var pageSize = config.pageSize
/**引入模块 */
var commonMoudle = require('util/business/common.js')
module.exports = (function () {
    /**---------------------------角色权限管理 start----------------------————-------------- */

    /**角色权限管理下拉框 */
    function showRoleSelect () {
        commonMoudle.getCenterInfo(function (data) {
            var list = [].concat({
                centerName: local.all,
                centerNo: ""
            },
                data
            );
            // 默认显示第一个
            $(".role-manage-container .select-custom").html(
                template($("#select-custom").html(), {
                    select: {
                        list: list,
                        centerNo: list[0].centerNo,
                        text: local.selectCategory
                    }
                })
            );
            $('.role-manage-container .input').val('');
            showRoleTable();
            // 为下拉列表添加事件 设置centerNo的值
            commonMoudle.selectAddEvent("role-manage-container", function (index) {
                var $centerNo = $(".role-manage-container .center-no");
                $centerNo.text(list[index].centerNo);
            });
        });
    }

    /**
     * 角色管理请求列表
     * @param  options
     * currentPage 当前页
     * wrapId  表格的分页容器id
     * callback  分页后的回调
     */
    function requestRoleTable (options) {
        // 请求的时候进行判断
        util.changeInput(typeInput.orleInput);
        request.post(
            userRouter.queryPage, {
            keyWord: options.keyWord,
            centerNo: options.centerNo,
            pageNum: options.currentPage,
            pageSize: pageSize
        },
            function (res) {
                // 渲染表格
                commonMoudle.renderTable("role-table", "1", {
                    list: res.data,
                    total: res.totalCount
                });
                if (res.data.length === 0) {
                    $("#" + options.wrapId).hide();
                    $('.role-no-data').show();
                } else {
                    $("#" + options.wrapId).show();
                    $('.role-no-data').hide();
                }
                // 创建分页
                if (options.firstRequest) {
                    commonMoudle.createPage({
                        wrapId: options.wrapId,
                        currentPage: options.currentPage,
                        total: res.totalCount,
                        callback: options.callback
                    });
                }
                // 列表渲染完成进行事件绑定
                var $remove = $("#role-table .remove-img");
                $remove.off();
                $remove.on("click", function () {
                    var index = $remove.index(this);
                    commonMoudle.deleteTips(
                        local.sureToRemove,
                        function () {
                            request.delete(
                                userRouter.del, {
                                userId: res.data[index].userId
                            },
                                function () {
                                    $(".mask").hide();
                                    showRoleTable();
                                }
                            );
                        },
                        "warn",
                        function () { }
                    );
                });
            }
        );
    }
    /**角色管理 显示当前的表格 */
    function showRoleTable (currentPage) {
        var keyWord = commonMoudle.myTrim($(".role-manage-container .input").val());
        var centerNo = $(".role-manage-container .center-no").text();
        requestRoleTable({
            firstRequest: true,
            wrapId: "role-foot",
            keyWord: keyWord,
            centerNo: centerNo,
            currentPage: currentPage || 1,
            callback: function (current) {
                requestRoleTable({
                    wrapId: "role-foot",
                    keyWord: keyWord,
                    centerNo: centerNo,
                    currentPage: current
                });
            }
        });
    }
    /**角色管理点击搜索 */
    $(".role-manage-container .search-img").on("click", function () {
        showRoleTable();
    });

    /** 新增管理员 角色管理 新增*/
    $(".role-manage-container .add-btn").on("click", function () {
        $("#mask").html(
            template($("#alert-component").html(), {
                showContentType: 3,
                showDefaultAlert: false,
                roleCustom: "role-box",
                title: local.addSystemAdmin
            })
        );
        // placeholder兼容处理
        util.changeInput(typeInput.orleAddInput);
        var $searchBtn = $(".role-content .role-search");
        var userInfo = null;
        //  角色管理 搜索按钮
        $searchBtn.off();
        $searchBtn.on("click", function () {
            userInfo = null;
            var inputValue = $(".role-content .role-input").val();
            if (!inputValue) {
                commonMoudle.myAlert(local.pleaseInputId, 'custom-mask');
                return;
            }
            request.post(
                userRouter.queryOrgUser, {
                username: inputValue
            },
                function (result) {
                    $(".role-table tbody .role-body-tr").eq(0).siblings('.role-body-tr').remove();
                    $.each(result, function (i, v) {
                        var tr = $(".role-content .role-body-tr")
                            .clone(true)
                            .get(0);
                        var $tr = $(tr);
                        $tr
                            .find(".user-id")
                            .text(v.employeesNo);
                        $tr
                            .find(".user-id")
                            .attr('title', v.employeesNo);
                        $tr
                            .find(".user-name")
                            .text(v.userName);
                        $tr
                            .find(".center-name")
                            .text(v.centerName);
                        $tr
                            .find(".icon")
                            .removeClass("add-icon");
                        $(".role-table tbody").append(tr);
                    });
                    var $body = $(".role-table .role-body-tr");
                    if ($body.length > 1) {
                        $(".role-table .role-body-tr")
                            .eq(0)
                            .remove();
                    }
                    // 选择角色的按钮
                    $(".role-content .role-body-tr").on("click", function () {
                        var index = $(this).index();
                        userInfo = result[index - 1];
                        $(this)
                            .find(".icon")
                            .addClass("add-icon")
                            .parent()
                            .parent()
                            .siblings()
                            .find(".icon")
                            .removeClass("add-icon");
                    });
                }
            );
        });
        commonMoudle.clickButton(
            function () {
                if (!userInfo) {
                    commonMoudle.myAlert(local.pleaseSearchUser, 'custom-mask');
                    return;
                }
                request.post(userRouter.addSysUser, userInfo, function (res) {
                    showRoleTable();
                    $(".mask").hide();
                });
            },
            function () { }
        );
    });
    return {
        showRoleSelect: showRoleSelect
    }
    /**---------------------------角色权限管理 end------------------——————------------------ */
})()
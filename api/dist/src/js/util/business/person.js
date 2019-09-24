var $ = require("jquery");
var request = require("request");
var config = require("util/config.js");
var util = require('util/util.js');
var local = require('util/message.js').ch;
var codeRouter = config.codeRouter;
var smartRouter = config.smartRouter;
var typeInput = util.typeInput;
module.exports = (function () {
    /**---------------------------个人常用码管理 start------------------------------------ */

    /**
     * 请求个人管理列表数据
     * @param options
     * @type Object    参数类型
     * @property inputWords "K02.9" 输入关键字
     * @property showDelete     显示删除图标
     * @property showCollection  显示收藏图标
     * @property id    表格的id
     * @property router 服务地址
     * @property type  类型 新增列表需要的参数
     * @property current 当前页
     *
     * 表格的渲染分为4个步骤
     * 1、请求数据
     * 2、渲染表格
     * 3、创建分页
     * 4、添加事件监听
     */
    function personRequest (options) {
        // 请求的时候进行判断
        if (options.type === 2) {
            util.changeInput(typeInput.personAddInput);
        } else {
            util.changeInput(typeInput.personInput);
        }
        var personData = [];
        // 请求数据
        request.post(
            options.router, {
            inputWords: options.inputWords,
            type: options.type,
            pageNum: options.current,
            pageSize: pageSize
        },
            function (res) {
                $.each(res.data, function (i, v) {
                    personData.push({
                        icdCode: v.icdCode,
                        enName: v.enName,
                        cnName: v.cnName,
                        codeType: v.codeType,
                        showDelete: options.showDelete,
                        showCollection: options.showCollection
                    });
                });

                // 渲染表格
                renderTable(options.id, "2", {
                    list: personData,
                    total: res.totalCount,
                    showSearchColumn: false,
                    showSpecialty: false
                });
                if (personData.length === 0) {
                    $("#" + options.wrapId).hide();
                    $('.' + options.wrapId + '-no-data').show();
                } else {
                    $("#" + options.wrapId).show();
                    $('.' + options.wrapId + '-no-data').hide();
                }
                // 创建分页
                // 如果分页容器id存在就创建分页
                if (options.firstRequest) {
                    createPage({
                        wrapId: options.wrapId,
                        total: res.totalCount,
                        currentPage: options.current,
                        callback: options.callback
                    });
                }
                // 渲染完成后进行事件监听
                if (options.type === 2) {
                    personColletion(res, options.inputWords, options.current);
                } else {
                    personDelete(res, options.current);
                }
            },
            function (err) { }
        );
    }

    // 删除个人收藏
    function personDelete (res, current) {
        var $delete = $("#person-manage-table .delete-icon");
        $delete.off();
        $delete.on("click", function () {
            var index = $delete.index(this);
            var icdCode = res.data[index].icdCode;
            deleteTips(local.sureToDeleteCode, function () {
                request.delete(
                    codeRouter.del, {
                    icdCode: icdCode
                },
                    function () {
                        $(".mask").hide();
                        showpersonManageTable(
                            $(".person-first .search-value").val());
                    },
                    function (err) { }
                );
            }, "warn");
        });
    }
    // 进行收藏
    function personColletion (res, inputValue, current) {
        var $collection = $("#person-add-table .collection-icon");
        $collection.off();
        $collection.on("click", function () {
            var index = $collection.index(this);
            var icdCode = res.data[index].icdCode;
            // 如果已经收藏了就不进行收藏
            if ($(this).hasClass('collection-icon-active')) {
                return
            }

            request.post(
                codeRouter.add, {
                icdCode: icdCode
            },
                function () {
                    $collection.eq(index).addClass("collection-icon-active");
                    // showpersonAddTable(inputValue, current);
                },
                function (err) { }
            );
        });
    }
    /**个人常用码 管理列表 */
    function showpersonManageTable (inputWords, currentPage) {
        var inputWords = myTrim(inputWords);
        personRequest({
            inputWords: inputWords,
            showDelete: true,
            id: "person-manage-table",
            router: codeRouter.queryPage,
            wrapId: "person-manage-foot",
            current: currentPage || 1,
            firstRequest: true,
            callback: function (current) {
                personRequest({
                    inputWords: inputWords,
                    showDelete: true,
                    id: "person-manage-table",
                    router: codeRouter.queryPage,
                    wrapId: "person-manage-foot",
                    current: current
                });
            }
        });
    }
    /** 个人常用码 新增个人常用码列表 */
    function showpersonAddTable (inputWords, currentPage) {
        var inputWords = myTrim(inputWords);
        personRequest({
            inputWords: inputWords,
            showCollection: true,
            type: 2,
            id: "person-add-table",
            router: smartRouter.querySmartCode,
            wrapId: "person-add-foot",
            current: currentPage || 1,
            firstRequest: true,
            callback: function (current) {
                personRequest({
                    inputWords: inputWords,
                    showCollection: true,
                    id: "person-add-table",
                    type: 2,
                    router: smartRouter.querySmartCode,
                    wrapId: "person-add-foot",
                    current: current
                });
            }
        });
    }

    /**个人常用管理切换显示列表 */
    function personManage () {
        var $personFirst = $(".person-first"),
            $personSecond = $(".person-second");
        //  新增按钮事件
        $(".person-add").on("click", function () {
            $personFirst.hide();
            $personSecond.show();
            // 新增个人列表， 先将搜索词清空，在将列表清空
            $(".person-second .search-value").val("");
            renderTable("person-add-table", "2", {
                list: [],
                total: 0,
                showSearchColumn: false,
                showSpecialty: false
            });
            // placeholder兼容处理
            util.changeInput(typeInput.personAddInput);
            $("#person-add-foot").hide();
            $('.person-add-foot-no-data').show();
        });
        //  新增代码管理返回按钮事件
        $(".person-back").on("click", function () {
            $personFirst.show();
            $personSecond.hide();
            $(".person-first .search-value").val('')
            showpersonManageTable('');
        });
        //个人常用管理
        $(".person-first .search-btn").on("click", function () {
            showpersonManageTable($(".person-first .search-value").val());
        });
        // 新增个人常用管理
        $(".person-second .search-btn").on("click", function () {
            showpersonAddTable($(".person-second .search-value").val());
        });
    }
    return {

    }

    /**---------------------------个人常用码管理 end------------------------------------ */
})()
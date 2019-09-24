var $ = require("jquery");
var request = require("request");
var config = require("util/config.js");
var util = require('util/util.js');
var local = require('util/message.js').ch;
var template = require("template");
var olarRouter = config.olarRouter;
var smartRouter = config.smartRouter;
var currentOlarRouter = olarRouter.person;
var typeInput = util.typeInput;
module.exports = (function () {

    /**---------------------------口语名词检索管理 start------------------------------------ */
    /** 科室下拉列表的渲染
     *
     * 专科的选择，
     * 这里有几种情况
     *  1、新增的时候
     *  2、编辑的时候
     *  3、列表显示的时候
     *  isAdd是否是添加 、编辑
     *   centerNo 是否有科室
     *   options 判断是否有值
     */
    function specialtySelect (options) {
        var options = options || {};
        var centerNo = '';
        var centerName = '';
        getCenterInfo(function (data) {
            var list = [].concat({
                centerName: local.all,
                centerNo: ""
            },
                data
            );
            // 区分不同的下拉框， 新增时候的下拉框 在类名 oral-zk下  非新增select-specialty
            var container = options.isAdd ? "oral-zk" : "select-specialty";
            // 添加 编辑
            if (options.isAdd) {
                list = data;
                centerNo = options.centerNo;
                centerName = options.centerName;
            } else {
                // 口语列表
                centerName = list[0].centerName;
                centerNo = list[0].centerNo;
            }
            // 渲染下拉列表
            $("." + container + " .select-custom").html(
                template($("#select-custom").html(), {
                    select: {
                        list: list,
                        centerNo: centerNo,
                        text: centerName
                    }
                })
            );
            // 渲染之后进行判断是否能够进行输入
            checkClickSearch();
            // 为下拉列表添加事件
            selectAddEvent(container, function (index) {
                var $centerNo = $("." + container + " .center-no");
                $centerNo.text(list[index].centerNo);
                // 渲染之后进行判断是否能够进行输入
                checkClickSearch();
                if (!options.isAdd) {
                    showSpecialtyTable();
                }
            });
        });
    }
    /**判断是否口语进行点击查询 */
    function checkClickSearch () {
        if (oralCurrentIndex === 2) {
            if ($('.oral-zk .center-no').text()) {
                $('.add-search-box .input').attr('disabled', false);
                $('.add-search-box .search-img').removeClass('no-allow');
            } else {
                $('.add-search-box .input').attr('disabled', true);
                $('.add-search-box .search-img').addClass('no-allow');
            }
        } else {
            $('.add-search-box .input').attr('disabled', false);
            $('.add-search-box .search-img').removeClass('no-allow');
        }
    }

    /**口语名词次级导航 */
    function subNavChange () {
        var $subItems = $(".oral-manage-container .sub-nav-item");
        var $subContents = $(".oral-manage-container .sub-content");
        $subItems.on("click", function () {
            var $index = $(this).index();
            oralCurrentIndex = $index + 1;
            // 此时判断当前的口语名词路由
            currentOlarRouter =
                oralCurrentIndex === 1 ? olarRouter.person : olarRouter.other;
            $subItems
                .removeClass("sub-nav-item-active")
                .eq($index)
                .addClass("sub-nav-item-active");
            $subContents
                .hide()
                .eq($index)
                .show();
            switch ($index) {
                case 0:
                    showPersonTable();
                    break;
                case 1:
                    // 还原下拉框 搜索全部
                    specialtySelect();
                    $(".select-specialty .center-no").text('');
                    showSpecialtyTable();
                    break;
                case 2:
                    showWholeTable();
                    break;
                default:
                    break;
            }
        });
    }

    /**
     * 渲染口语表格增加事件监听
     * showSpecialty 显示科别
     * @param {表格id} tableId
     * @param {表格数据} data
     * @param {表格总数} total
     */
    function renderTableAddEventListen (options) {
        // 渲染表格
        renderTable(options.tableId, "2", {
            list: options.data,
            total: options.total,
            showSearchColumn: true,
            showSpecialty: oralCurrentIndex === 2
        });
        // 列表渲染完成绑定事件
        var $edit = $("#" + options.tableId + " .edit-icon");
        var $delete = $("#" + options.tableId + " .delete-icon");
        var res = {
            data: options.data,
            total: options.total
        };
        editAndDelete($edit, $delete, res);
    }

    // 请求数据
    /**
     *
     * @param {所需参数} options
     * currentPage 当前页
     * wrapId 分页容器id
     * callback 分页的回调
     */
    function requestOralData (options) {
        var oralData = [];
        var currentTypes = ["person", "specialty", "whole"];
        oralCurrentPage = options.currentPage;
        // 请求之前先清空表格
        renderTable("oral-" + currentTypes[oralCurrentIndex - 1] + "-table", "2", {
            list: [],
            total: 0,
            showSearchColumn: true,
            showSpecialty: oralCurrentIndex === 2
        });
        $("#" + options.wrapId).hide();
        request.post(
            currentOlarRouter.queryPage, {
            centerNo: options.centerNo,
            centerNoType: oralCurrentIndex,
            pageNum: options.currentPage,
            pageSize: pageSize
        },
            function (res) {
                // 处理请求的数据
                $.each(res.data, function (i, v) {
                    oralData.push({
                        wordIds: v.wordIds,
                        icdCode: v.icdCode,
                        enName: v.enName,
                        cnName: v.cnName,
                        centerNo: v.centerNo,
                        centerName: v.centerName,
                        words: v.words,
                        showEdit: true,
                        showDelete: true
                    });
                });
                // 根据类型渲染表格
                renderTableAddEventListen({
                    tableId: "oral-" + currentTypes[oralCurrentIndex - 1] + "-table",
                    data: oralData,
                    total: res.totalCount
                });
                if (oralData.length === 0) {
                    $("#" + options.wrapId).hide();
                    $('.oral-' + currentTypes[oralCurrentIndex - 1] + '-no-data').show();
                } else {
                    $("#" + options.wrapId).show();
                    $('.oral-' + currentTypes[oralCurrentIndex - 1] + '-no-data').hide();
                }
                // 创建分页
                if (options.firstRequest) {
                    createPage({
                        wrapId: options.wrapId,
                        total: res.totalCount,
                        currentPage: options.currentPage,
                        callback: options.callback
                    });
                }
            }
        );
    }
    /**口语名词 编辑口语名词 列表的编辑和删除 */
    function editAndDelete ($edit, $delete, res) {
        // 编辑
        $edit.on("click", function () {
            var index = $edit.index(this);
            wordIds = res.data[index].wordIds;
            oralEidtShow(res.data[index]);
        });
        // 删除
        $delete.on("click", function () {
            var index = $delete.index(this);
            deleteTips(local.sureToDeleteNon, function () {
                request.delete(
                    currentOlarRouter.del, {
                    ids: res.data[index].wordIds.split(",")
                },
                    function () {
                        $(".mask").hide();
                        refreshTable();
                    }
                );
            }, "warn");
        });
    }
    /**口语名词 个人 */
    function showPersonTable (currentPage) {
        requestOralData({
            currentPage: currentPage || 1,
            wrapId: "oral-person-foot",
            firstRequest: true,
            callback: function (current) {
                requestOralData({
                    wrapId: "oral-person-foot",
                    currentPage: current
                });
            }
        });
    }
    /**口语名词 专科*/
    function showSpecialtyTable (currentPage) {
        // var centerNo = isAdd ? "" : $(".select-specialty .center-no").text();
        var centerNo = $(".select-specialty .center-no").text();
        requestOralData({
            currentPage: currentPage || 1,
            wrapId: "oral-specialty-foot",
            firstRequest: true,
            centerNo: centerNo,
            callback: function (current) {
                requestOralData({
                    currentPage: current,
                    wrapId: "oral-specialty-foot",
                    centerNo: centerNo
                });
            }
        });
    }

    /**口语名词 全院 */
    function showWholeTable (currentPage) {
        requestOralData({
            currentPage: currentPage || 1,
            wrapId: "oral-whole-foot",
            firstRequest: true,
            callback: function (current) {
                requestOralData({
                    wrapId: "oral-whole-foot",
                    currentPage: current
                });
            }
        });
    }
    /**口语名词的显示 */
    function showText (title, isEdit) {
        $(".oral-content").hide();
        $(".oral-content-add").show();
        $(".is-zk").hide();
        $(".oral-content-add  .text-1").text(title);
        clearEditData();
        $(".oral-content-add  .text-3").show();
        if (oralCurrentIndex === 1) {
            $(".oral-content-add  .text-2").text(local.person);
            $(".oral-content-add  .text-4").text(userInfo.centerName);
            $(".oral-other ").show();
        } else if (oralCurrentIndex === 2) {
            $(".oral-content-add  .text-2").text(local.specialized);
            $(".oral-zk ").show();
            if (!isEdit) {
                specialtySelect({
                    isAdd: true,
                    centerName: local.selectSpecialized,
                    centerNo: ''
                });
            }
        } else {
            $(".oral-content-add  .text-2").text(local.whole);
            $(".oral-content-add  .text-3").hide();
            $(".oral-content-add  .text-4").text("");
            $(".oral-other").show();
        }
        // 对placeholder兼容处理
        util.changeInput(typeInput.oralAddInput);
        util.handleMoreInput();
    }
    /**清空回显的数据 还原数据 */
    function clearEditData () {
        checkClickSearch();
        renderTable("oral-search-table", "2", {
            list: [],
            total: 0,
            showSearchColumn: false,
            showSpecialty: false
        });
        oralAddNum = 1;
        $(".oral-content-add .search-input").val("");
        var box = $(".add-box .add-key-box")
            .clone(true)
            .get(0);
        var $box = $(box);
        $box.find(".num").text(1);
        $box.find(".input").val("");
        $(".add-box")
            .empty()
            .append($box);
    }
    /**编辑回显 */
    function oralEidtShow (data) {
        showText(local.editCategory, true);
        var searchData = [];
        searchData.push({
            icdCode: data.icdCode,
            enName: data.enName,
            cnName: data.cnName,
            showDelete: true
        });
        // 专科要进行下拉框的回显
        specialtySelect({
            isAdd: true,
            centerNo: data.centerNo,
            centerName: data.centerName
        });
        // 渲染表格
        renderTable("oral-search-table", "2", {
            list: searchData,
            total: searchData.length,
            showSearchColumn: false,
            showSpecialty: false
        });
        // 搜索口语名词表格删除图标
        oralSearchDelete();
        var editWords = data.words.split(",");
        oralAddNum = editWords.length || 1;
        $.each(editWords, function (i, v) {
            var box = $(".add-box .add-key-box")
                .clone(true)
                .get(0);
            var $box = $(box);
            $box.find(".num").text(i + 1);
            $box.find(".input").val(v);
            $(".add-box").append($box);
        });
        $(".add-box .add-key-box")
            .eq(0)
            .remove();
        // 对placeholder兼容处理
        util.changeInput(typeInput.oralAddInput);
        util.handleMoreInput();
    }
    /**请求搜寻的口语列表 */

    var showCheck = "";
    function requestSearchList (options) {
        var searchData = [];
        request.post(
            smartRouter.querySmartWordCode, {
            type: oralCurrentIndex,
            keyWord: options.inputWords,
            pageNum: options.current,
            pageSize: pageSize,
            centerNo: $('.oral-zk .center-no').text()
        },
            function (res) {
                if (res.data.length === 0) {
                    myAlert(local.codeSearchNo);
                    return
                }
                if (options.firstRequest) {
                    // 渲染表格弹框
                    $("#mask").html(template($("#table-alert").html()));
                    $(".alert-content .close-black").on("click", function () {
                        $(".mask").hide();
                    });
                }
                $.each(res.data, function (i, v) {
                    searchData.push({
                        icdCode: v.icdCode,
                        enName: v.enName,
                        cnName: v.cnName,
                        wordType: v.wordType,
                        showIcon: options.showIcon,

                    });
                });
                // 渲染表格
                renderTable(options.id, "2", {
                    list: searchData,
                    total: res.totalCount,
                    showSearchColumn: false,
                    showSpecialty: false
                });
                //  判断是否查到数据
                if (searchData.length === 0) {
                    $("#" + options.wrapId).hide();
                    $('.' + options.wrapId + '-no-data').show();
                } else {
                    $("#" + options.wrapId).show();
                    $('.' + options.wrapId + '-no-data').hide();
                }
                // 创建分页
                // 如果第一次请求就创建分页
                if (options.firstRequest) {
                    createPage({
                        wrapId: options.wrapId,
                        total: res.totalCount,
                        currentPage: options.current,
                        callback: options.callback
                    });
                }
                //  添加事件监听
                var $tr = $(".table-mask-alert .table-tr");
                $tr.off();
                $tr.on("click", function () {
                    var index = $tr.index(this);
                    var v = searchData[index];
                    var list = [];
                    showCheck = v.icdCode;
                    if (v.wordType) {
                        myAlert(local.recordExists)
                        return
                    }
                    $(this)
                        .find(".img-icon")
                        .addClass("add-icon")
                        .parent()
                        .parent()
                        .siblings()
                        .find(".img-icon")
                        .removeClass("add-icon");
                    list.push({
                        icdCode: v.icdCode,
                        enName: v.enName,
                        cnName: v.cnName,
                        showDelete: true
                    });
                    renderTable("oral-search-table", "2", {
                        list: list,
                        total: list.length,
                        showSearchColumn: false,
                        showSpecialty: false,
                        showTool: 'hide'
                    });

                    // 搜索口语名词表格删除图标
                    oralSearchDelete();
                });
                //修复分页跳转后当前所选被重新渲染抹去的问题
                // console.log(showCheck);
                $.each(res.data, function (i, v) {
                    if (v.icdCode == showCheck) {
                        $tr.eq(i).trigger("click");
                    }
                })
            }
        );
    }

    /**口语搜索名词删除事件 */
    function oralSearchDelete () {
        $('.oral-search-table .delete-icon').off();
        $('.oral-search-table .delete-icon').on('click', function () {
            renderTable("oral-search-table", "2", {
                list: [],
                total: 0,
                showSearchColumn: false,
                showSpecialty: false
            });
        })
    }
    /**口语名词 新增名词 */
    $(".oral-manage-container .add-name").on("click", function () {
        // 对palceholder进行兼容
        util.changeInput(typeInput.oralAddInput);
        showText(local.addCategory);
    });

    /**新增口语名词  取消 */
    $(".oral-content-add .add-cancel").on("click", function () {
        clearEditData();
        $(".oral-content").hide();
        $(".oral-content-list").show();
        refreshTable(oralCurrentPage);
    });

    /**新增口语名词  确定 */
    /**口语名词 点击弹框确定或取消按钮 */
    $(".oral-content-add .add-sure").on("click", function () {
        var words = [];
        var icdCode = $("#oral-search-table .td-code").text();
        $(".add-box .add-key-box").each(function (i, v) {
            var inputValue = $(v)
                .find(".input")
                .val();
            var index = $.inArray(inputValue, words);
            if (inputValue && index === -1) {
                words.push(
                    $(v)
                        .find(".input")
                        .val()
                );
            }
        });

        if (!$('.oral-zk .center-no').text() && oralCurrentIndex === 2) {
            myAlert(local.pleaseSelectCategory);
            return
        }

        if (!icdCode || words.length === 0) {
            myAlert(local.inputNotComplete);
            return;
        }
        if (util.hasSpecialChar(words)) {
            myAlert(local.keyWordLimit);
            return
        }
        if (!wordIds) {
            requestAdd(icdCode, words);
        } else {
            requestEdit(icdCode, words);
        }
    });
    /**新增口语名词
     *  搜索
     * 1、 显示弹框
     * 2、 渲染表格
     * 3、 增加分页
     * 4、 添加点击事件
     * 5、 存取点击后的数据
     * 6、 点击关闭
     * 7、将数据渲染至页面表格
     * 8、 点击 添加
     *
     * */
    $(".oral-content-add .add-search-box .search-img").on("click", function () {
        // 判断是否是科室新增
        if (oralCurrentIndex === 2 && !$('.oral-zk .center-no').text()) {
            return
        }
        if (!$(".add-search-box .search-input").val()) {
            request.myAlert(local.pleaseInputIcd);
            return;
        }
        // 渲染表格
        requestSearchList({
            inputWords: $(".oral-content-add .search-input").val(),
            showIcon: true,
            id: "table-mask-alert",
            wrapId: "table-alert-foot",
            current: 1,
            firstRequest: true,
            callback: function (current) {
                requestSearchList({
                    inputWords: $(".oral-content-add .search-input").val(),
                    showIcon: true,
                    id: "table-mask-alert",
                    wrapId: "table-alert-foot",
                    current: current
                });
            }
        });
    });
    /**点击新增编辑名词弹框加号按钮 */
    $(".add-btn-img").on("click", function () {
        if (oralAddNum >= 5) {
            myAlert(local.upToFive);
            return;
        }
        oralAddNum++;
        var box = $(".add-key-box")
            .clone(true)
            .get(0);
        $(".add-box").append(box);
        $(box)
            .find(".num")
            .text(oralAddNum);
        $(box)
            .find(".input")
            .val("");
        // 对placeholder兼容处理
        util.handleMoreInput();
    });
    /**删除 */
    $(".add-box .close-btn").on("click", function () {
        if (oralAddNum <= 1) {
            myAlert(local.lessLeastOne);
            return;
        }
        oralAddNum--;
        $(this)
            .parent()
            .remove();
        $(".add-box .add-key-box").each(function (i, v) {
            $(v)
                .find(".num")
                .text(i + 1);
        });
        // 对placeholder兼容处理
        util.handleMoreInput();
    });
    /** 口语名词
     *  增加口语名词请求
     *
     * 个人的新增   olarRouter.addPersonal
     * 专科和全院新增 olarRouter.add
     *
     * */
    function requestAdd (icdCode, words) {
        request.post(
            currentOlarRouter.add, {
            centerNo: $(".oral-zk .center-no").text(),
            centerNoType: oralCurrentIndex,
            icdCode: icdCode,
            words: words
        },
            function () {
                // $(".select-specialty .text").text('全部');
                refreshTable();
            },
            function (err) { }
        );
    }
    /**口语名词  编辑口语名词 */
    function requestEdit (icdCode, words) {
        request.put(
            currentOlarRouter.update, {
            centerNo: $(".oral-zk .center-no").text(),
            centerNoType: oralCurrentIndex,
            icdCode: icdCode,
            words: words,
            wordIds: wordIds
        },
            function () {
                wordIds = null;
                // $(".select-specialty .text").text('全部');
                refreshTable(oralCurrentPage);
            },
            function (err) { }
        );
    }
    /**口语名词 刷新表格 */
    function refreshTable (currentPage) {
        clearEditData();
        $(".oral-content").hide();
        $(".oral-content-list").show();
        if (oralCurrentIndex === 1) {
            showPersonTable(currentPage);
        } else if (oralCurrentIndex === 2) {
            showSpecialtyTable(currentPage);
        } else {
            showWholeTable(currentPage);
        }
    }

    return {

    }
    /**---------------------------口语名词检索管理 end------------------------------------ */

})()
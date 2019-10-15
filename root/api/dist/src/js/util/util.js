/**获取滚动条的宽度 */
var $ = require('jquery');
require('lib/placeholder');
var typeInput = {
    orleInput: 0,
    orleAddInput: 1,
    personInput: 2,
    personAddInput: 3,
    oralAddInput: 4
}
/**获取滚动条宽度 */
function getScrollbarWidth() {
    var $div = $('<div></div>');
    $div.css({
        width: 100,
        height: 100,
        overflowY: 'scroll'
    })
    var div = $div[0];
    $(document.body).append(div);
    $div.offsetWidth
    scrollbarWidth = div.offsetWidth - div.clientWidth; //相减
    $div.remove(); //移除创建的div
    return scrollbarWidth; //返回滚动条宽度
}

/**图片预加载 */
function preloadimages(arr) {
    var newimages = []
    var arr = (typeof arr != "object") ? [arr] : arr //确保参数总是数组
    for (var i = 0; i < arr.length; i++) {
        newimages[i] = new Image()
        newimages[i].src = arr[i]
    }
}

/**阻止事件冒泡 */
function cancelBubble(e) {
    if (window.event) {
        e.cancelBubble = true; //阻止冒泡  IE浏览器
    } else if (e.preventDefault) {
        e.stopPropagation(); //阻止冒泡 非IE
    }
}

/**判断ie */
function isIE() {
    if (!!window.ActiveXObject || "ActiveXObject" in window) return true;
    else return false;
}
/**判断IE11 */
function isIE11() {
    if ((/Trident\/7\./).test(navigator.userAgent)) return true;
    else return false;
}
/**判断是否是ie9及以下版本 */
function isIeBrowser() {
    return navigator.appName == "Microsoft Internet Explorer" &&
        parseInt(
            navigator.appVersion
            .split(";")[1]
            .replace(/[ ]/g, "")
            .replace("MSIE", "")
        ) <= 9
}
/**判断是ie几 */
function isIe(n) {
    return navigator.appName == "Microsoft Internet Explorer" &&
        parseInt(
            navigator.appVersion
            .split(";")[1]
            .replace(/[ ]/g, "")
            .replace("MSIE", "")
        ) === n
}
/**判断数组中是否含有特殊字符 */
function hasSpecialChar(array) {
    var flag = false;
    var arr = array || [];
    for(var i=0;i<arr.length;i++){
        var reg = /^[\u4e00-\u9fa5\.a-zA-Z0-9\s]+$/g;
        if(!reg.test(arr[i])){
            flag = true
        }
    }
    return flag
}

/**设置为ie9以下的浏览器placeholder */
function setPlaceHolder(className, placeholder, zIndex) {
    if (isIeBrowser()) {
        $('.' + className).val('');
        $('.' + className).placeholder({
            word: placeholder,
            evtType: 'keydown',
            zIndex: zIndex || 1
        });
    }
}
/**placehoder问题 */
var JPlaceHolder = {
    //检测
    _check: function () {
        return 'placeholder' in document.createElement('input');
    },
    //初始化
    init: function () {
        if (!this._check()) {
            this.fix();
        }
    },
    //修复
    fix: function () {
        $('[placeholder]').each(function (index, element) {

            var self = $(this),
                txt = self.attr('placeholder');
            self.wrap($('<div></div>').css({
                position: 'relative',
                zoom: '1',
                border: 'none',
                background: 'none',
                padding: 'none',
                margin: 'none'
            }));
            var pos = self.position(),
                h = self.outerHeight(true),
                paddingleft = self.css('padding-left');
            var holder = "";
            if ($(this).val() == "") {
                holder = $('<span></span>').text(txt).css({
                    position: 'absolute',
                    left: pos.left,
                    top: pos.top,
                    height: h,
                    lienHeight: h,
                    paddingLeft: paddingleft,
                    color: '#aaa'
                }).appendTo(self.parent());
            } else {
                holder = $('<span></span>').text("").css({
                    position: 'absolute',
                    left: pos.left,
                    top: pos.top,
                    height: h,
                    lienHeight: h,
                    paddingLeft: paddingleft,
                    color: '#aaa'
                }).appendTo(self.parent());
            }
            self.keydown(function (e) {
                holder.hide();
            }).focusout(function (e) {
                if (!self.val()) {
                    holder.show();
                }
            });
            holder.click(function (e) {
                holder.hide();
                self.focus();
            });
        });
    }
}
/**
 * 
 * 自定义placeholder事件
 * 为了保证每个输入框都是独立的，传入span和input 
 * 为唯一的， 保证不干扰其他的输入框
 */
function definePlaceholder(type) {
    var $span = $('#span-place-holder-' + type),
        $input = $('#input-place-holder-' + type);
    // 调用前先进行判断是否有值
    checkInput();
    // 为了事件只绑定一次
    $span.off();
    $input.off();
    $span.on('click', function () {
        $input.focus();
    })
    $input.on('input', function () {
        checkInput();
    })
    $input.on('blur', function () {
        checkInput();
    })

    function checkInput() {
        if ($input.val()) {
            $span.hide();
        } else {
            $span.show();
        }
    }
}
/**
 * 切换输入框， 同一时间只存在一个输入框
 *
 */
function changeInput(type) {
    switch (type) {
        case 0:
            // 角色管理页面输入框
            definePlaceholder(type);
            break;
        case 1:
            // 新增角色管理输入框
            definePlaceholder(type);
            break;
        case 2:
            // 个人常用码管理输入框
            definePlaceholder(type);
            break;
        case 3:
            // 新增个人常用码管理输入框
            definePlaceholder(type);
            break;
        case 4:
            // 口语名词 新增输入框
            definePlaceholder(type);
            break;
        default:
            break;
    }
}
/**口语名词输入框对placeholder的兼容处理 */
function handleMoreInput() {
    var $inputBox = $('.more-input-box');
    var $input = $inputBox.find('.input');
    var $span = $inputBox.find('.place-holder');
    $span.off();
    $input.off();
    $input.each(function (index, ele) {
        if (ele.value) {
            $span.eq(index).hide();
        } else {
            $span.eq(index).show();
        }
    })
    $span.on('click', function () {
        var index = $span.index(this);
        $input.eq(index).focus();
    })

    $input.on('input', function () {
        var index = $input.index(this);
        checkInput($(this), index);
    })

    $input.on('blur', function () {
        var index = $input.index(this);
        checkInput($(this), index);
    })

    function checkInput($this, index) {
        if ($this.val()) {
            $span.eq(index).hide();
        } else {
            $span.eq(index).show();
        }
    }
}

module.exports = {
    getScrollbarWidth: getScrollbarWidth,
    preloadimages: preloadimages,
    cancelBubble: cancelBubble,
    isIE: isIE,
    isIE11: isIE11,
    isIeBrowser: isIeBrowser,
    isIe: isIe,
    setPlaceHolder: setPlaceHolder,
    JPlaceHolder: JPlaceHolder,
    changeInput: changeInput,
    handleMoreInput: handleMoreInput,
    typeInput: typeInput,
    hasSpecialChar:hasSpecialChar
}
function remChange() {
    var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
    var widthProportion = function () {
        var doc = document.body || document.documentElement
        var p = doc.clientWidth;
        return p / 7.5;
    }
    var changePage = function () {
        document.getElementsByTagName('html')[0].setAttribute('style', 'font-size:' + widthProportion() + 'px')
    }
    changePage()

    window.addEventListener(resizeEvt, changePage, false)
}
remChange();

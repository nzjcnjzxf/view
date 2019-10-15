/**语言国际化 */
var $ = require('jquery');
require("lib/jquery.i18n.js");
/**lang 可选参数 'tw' 'en' */
module.exports = (function () {
    function setLang(lang) {
        $("[i18n]").i18n({
            lang: lang,
            defaultLang: 'tw',
            filePath: "/i18n/",
            filePrefix: "i18n_",
            fileSuffix: "",
            forever: true,
            callback: function () {
                // console.log("i18n has been completed.");
            }
        });
    }
    return {setLang: setLang}
})()
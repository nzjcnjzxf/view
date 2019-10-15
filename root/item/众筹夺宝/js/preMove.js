// 不让页面移动
function preMove(ele) {
    document.querySelector(ele).addEventListener('touchmove', function (e) {
        e.preventDefault();
    })
}

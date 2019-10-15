
// 画布
const canvas = document.getElementById('game')
const context = canvas.getContext('2d')

// 设置画布
canvas.width = window.innerWidth
canvas.height = window.innerHeight

// 获取画布宽高
const canvasWidth = canvas.clientWidth
const canvasHeight = canvas.clientHeight

export {canvas, context, canvasWidth, canvasHeight}

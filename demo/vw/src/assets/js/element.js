/**
 * 父类 element对象
 */
class Element {
  constructor (options) {
    const opts = options || {}
    // 设置坐标设尺寸
    this.x = opts.x
    this.y = opts.y
    this.width = opts.width
    this.height = opts.height
    this.speed = opts.speed
    this.context = opts.context
    this.canvas = opts.canvas
    this.canvasWidth = options.canvasWidth
    this.canvasHeight = options.canvasHeight
  }
  move (x, y) {
    const addX = x || 0
    const addY = y || 0
    this.x += addX
    this.y += addY
  }
}

export default Element

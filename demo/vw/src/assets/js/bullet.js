import Element from './element'
/**
 * 子类 Bullet 子弹对象
 */
class Bullet extends Element {
  constructor (opts) {
    super(opts)
    this.icon = opts.icon
  }

  /**
         * 方法：fly 向上移动
         */
  fly () {
    this.move(0, -this.speed)
    return this
  }

  /**
       * 方法：hasCrash 子弹是否击中敌机
           */
  hasCrash (target) {
    let crash = false
    // 判断四边是否都没有空隙
    if (!(this.x + this.width < target.x) &&
            !(target.x + target.width < this.x) &&
            !(this.y + this.height < target.y) &&
            !(target.y + target.height < this.y)) {
      // 子弹击中敌机
      crash = true
    }
    return crash
  }

  /**
                  * 方法：draw 绘制子弹
                  */
  draw () {
    this.context.drawImage(this.icon, this.x, this.y, this.width, this.height)
    return this
  }
}

export default Bullet

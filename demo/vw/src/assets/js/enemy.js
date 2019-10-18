import Element from './element'
/**
 * 子类 Enemy 射击目标对象
 */
class Enemy extends Element {
  constructor (opts) {
    super(opts)
    // 特有属性状态和图标
    this.status = 'normal' // 可为normal booming boomed
    this.icon = opts.icon
    this.live = opts.live
    this.type = opts.type
    // 特有属性 爆炸相关
    this.boomIcon = opts.boomIcon
    this.boomCount = 0
  }
  /**
         * 方法：down 向下移动一个身位
         */
  down () {
    this.move(0, this.speed)
    return this
  }
  /**
         * 方法：booming 爆炸中
         */
  booming () {
    this.status = 'booming'
    this.boomCount += 1
    if (this.boomCount > 8) {
      this.status = 'boomed'
    }
    return this
  }
  /**
         * 方法：draw
         */
  draw () {
    // 绘制敌机
    switch (this.status) {
      case 'normal':
        this.context.drawImage(this.icon, this.x, this.y, this.width, this.height)
        break
      case 'booming':
        this.context.drawImage(this.boomIcon, this.x, this.y, this.width, this.height)
        break
    }
    return this
  }
}

export default Enemy

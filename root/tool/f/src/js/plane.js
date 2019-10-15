import Element from './element'
import {context} from './canvas'
import Bullet from './bullet'
/**
 * 子类 Plane 游戏主角 战机
 */
class Plane extends Element {
  constructor (opts) {
    super(opts)
    // 特有属性
    this.status = 'normal'
    this.icon = opts.icon
    // 特有属性，爆炸相关
    this.boomIcon = opts.boomIcon
    this.boomCount = 0

    // 子弹相关
    this.bullets = []
    this.bulletSize = opts.bulletSize
    this.bulletSpeed = opts.bulletSpeed
    this.bulletIcon = opts.bulletIcon
    this.shootSound = opts.shootSound
  }

  /**
   * 方法：setPos 设置移动后战机位置
   */
  setPos (newPlaneX, newPlaneY) {
    this.x = newPlaneX
    this.y = newPlaneY
    return this
  }

  /**
   * 方法：hasCrash 判断是否撞到当前元素
   */
  hasCrash (target) {
    let crash = false
    // 判断四边是否都没有空隙
    if (!(this.x + this.width < target.x) &&
      !(target.x + target.width < this.x) &&
      !(this.y + this.height < target.y) &&
      !(target.y + target.height < this.y)) {
      // 碰撞了
      crash = true
    }
    return crash
  }

  /**
   * 方法：hasHit 判断子弹是否击中目标
   */
  hasHit (target) {
    const bullets = this.bullets
    let hasHit = false
    for (let j = bullets.length - 1; j >= 0; j--) {
      // 如果子弹击中目标，则销毁子弹
      if (bullets[j].hasCrash(target)) {
        bullets.splice(j, 1)
        hasHit = true
        break
      }
    }
    return hasHit
  }

  /**
   * 方法：booming 爆炸中
   */
  booming () {
    this.status = 'booming'
    this.boomCount += 1
    if (this.boomCount > 10) {
      this.status = 'boomed'
      clearInterval(this.shooting)
    }
    return this
  }

  /**
   * 方法：startShoot 开始射击
   */
  startShoot () {
    const self = this
    const bulletWidth = this.bulletSize.width
    const bulletHeight = this.bulletSize.height

    this.shooting = setInterval(() => {
      // 子弹位置战机中间射出
      const bulletX = self.x + self.width / 2 - bulletWidth / 2
      const bulletY = self.y - bulletHeight
      // 配置子弹
      const initOpt = {
        x: bulletX,
        y: bulletY,
        width: bulletWidth,
        height: bulletHeight,
        speed: self.bulletSpeed,
        icon: self.bulletIcon
      }
      // 创建子弹
      self.bullets.push(new Bullet(initOpt))
    }, 200)
  }

  /**
   * 方法：drawBullet 绘制子弹
   */
  drawBullet () {
    const bullets = this.bullets
    let i = bullets.length
    while (i--) {
      const bullet = bullets[i]
      // 更新子弹位置
      bullet.fly() // 更新和绘制耦合在一起
      // 如果子弹超出上边界，则删除
      if (bullet.y <= 0) {
        bullets.splice(i, 1)
      } else {
        bullet.draw()
      }
    }
  }

  /**
   * 方法：draw 绘制战机
   */
  draw () {
    switch (this.status) {
      case 'booming':
        context.drawImage(this.boomIcon, this.x, this.y, this.width, this.height)
        break
      case 'normal':
        context.drawImage(this.icon, this.x, this.y, this.width, this.height)
        break
    }
    // 绘制子弹
    this.drawBullet()
    return this
  }
}

export default Plane

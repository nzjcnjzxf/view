import CONFIG from './config'
import resourceHelper from './resource'
import Plane from './plane'
import Enemy from './enemy'

// requestAnimationFrame
window.requestAnimFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 30)
    }

class Game {
  // 游戏初始化
  init (options) {
    const opts = Object.assign({}, options, CONFIG)
    const self = this

    // 默认飞机样式
    opts.planeType = opts.planeType || 'bluePlaneIcon'

    // 加载图片资源，加载完成才能游戏
    resourceHelper.load(opts.resources, (resources) => {
      // 更新图片和音乐
      self.images = resources['images']
      self.sounds = resources['sounds']
      self.planeIcon = self.images[opts.planeType]
      self.opts = opts
      self.opts.onInit && self.opts.onInit()
    })

    // 设置opts
    this.opts = opts
  }
  /**
                                                                                                       * 游戏设置
                                                                                                       */
  setGameOptions (opts) {
    // 根据配置设置飞机型号
    if (opts.planeType) {
      this.planeIcon = this.images[opts.planeType]
    }
  }
  /**
                                     * 生成战机方法
                                     */
  createPlane () {
    const opts = this.opts
    const images = this.images
    const { canvas, context, canvasWidth, canvasHeight } = opts
    // 飞机对象坐标范围
    this.planePosX = canvasWidth / 2 - opts.planeSize.width / 2
    this.planePosY = canvasHeight - opts.planeSize.height - 50

    // 每个元素配置
    const initOpt = {
      x: this.planePosX,
      y: this.planePosY,
      icon: this.planeIcon,
      width: opts.planeSize.width,
      height: opts.planeSize.height,
      boomIcon: images.enemyBigBoomIcon,
      bulletSize: opts.bulletSize, // 子弹长度
      bulletSpeed: opts.bulletSpeed,
      bulletIcon: images.fireIcon,
      canvas,
      context,
      canvasWidth,
      canvasHeight
    }
    this.plane = new Plane(initOpt)
    console.log(this.plane)
  }

  /**
                                                                                                       * 生成怪兽方法
                                                                                                       */
  createEnemy (type) {
    const enemies = this.enemies
    const opts = this.opts
    const images = this.images
    const { canvas, context, canvasWidth, canvasHeight } = opts
    // 默认敌机参数
    let enemySize = opts.enemySmallSize
    let enemySpeed = opts.enemySpeed
    let enemyIcon = images.enemySmallIcon
    let enemyBoomIcon = images.enemySmallBoomIcon
    let live = 1
    // 大型敌机参数
    if (type === 'big') {
      enemySize = opts.enemyBigSize
      enemyIcon = images.enemyBigIcon
      enemyBoomIcon = images.enemyBigBoomIcon
      enemySpeed = opts.enemySpeed * 0.6
      live = 10
    }
    // 每个元素的配置
    const initOpt = {
      x: Math.floor(Math.random() * (canvasWidth - enemySize.width)),
      y: -enemySize.height,
      type: type,
      live: live,
      width: enemySize.width,
      height: enemySize.height,
      speed: enemySpeed,
      icon: enemyIcon,
      boomIcon: enemyBoomIcon,
      canvas,
      context,
      canvasWidth,
      canvasHeight
    }
    if (enemies.length < 5) {
      enemies.push(new Enemy(initOpt))
    }
  }
  /**
                                                                                                       * 更新游戏状态，分别有以下几种状态：
                                                                                                       * start 游戏前
                                                                                                       * playing 游戏中
                                                                                                       * failed 游戏失败
                                                                                                       * success 游戏成功
                                                                                                       * stop 游戏暂停
                                                                                                       */
  setStatus (status) {
    this.status = status
  }

  /**
                                                                                                       * start 游戏开始需要设置
                                                                                                       * -创建飞机
                                                                                                       * -设置初始参数
                                                                                                       */
  start () {
    // 获取游戏初始化level
    const self = this

    // 清空射击目标对象数组
    this.enemies = []
    this.score = 0
    console.log('start')

    // 播放背景音乐
    // resourceHelper.playSound('gameSound', { loop: true })

    // 生成游戏主角战机
    self.createPlane()

    // 战机开始射击
    this.plane.startShoot(this.opts)
    // resourceHelper.playSound('shootSound')

    // 战机移动
    this.bindTouchAction()

    // 随机生成大小敌机
    this.createSmallEnemyInterval = setInterval(() => {
      self.createEnemy('normal')
    }, 500)
    this.createBigEnemyInterval = setInterval(() => {
      self.createEnemy('big')
    }, 1500)

    // 设置游戏状态
    this.setStatus('playing')

    // 开始动画循环
    this.update()
  }

  update () {
    const self = this
    const plane = this.plane
    const { context, canvasWidth, canvasHeight } = this.opts
    // 先清理画布
    context.clearRect(0, 0, canvasWidth, canvasHeight)

    // 更新战机、敌机
    this.updateElement()

    // 绘制画布
    this.draw()

    // 如果战机爆炸，则结束游戏
    if (plane.status === 'boomed') {
      this.setStatus('end')
      this.end()
      return
    }

    // 更新分数
    this.opts.onUpdate && this.opts.onUpdate()

    // 不断循环 update
    window.requestAnimFrame(() => {
      self.update()
    })
  }

  end () {
    // 先清理画布
    const { context, canvasWidth, canvasHeight } = this.opts
    context.clearRect(0, 0, canvasWidth, canvasHeight)

    // 清除游戏声音
    // resourceHelper.pauseSound('gameSound')
    // resourceHelper.pauseSound('shootSound')

    // 清除定时器
    clearInterval(this.createSmallEnemyInterval)
    clearInterval(this.createBigEnemyInterval)

    this.opts.onEnd && this.opts.onEnd()
  }

  /**
                                                                                                       * 方法 战机移动
                                                                                                       */
  bindTouchAction () {
    const opts = this.opts
    const planeMinX = 0
    const planeMinY = 0
    const planeMaxX = opts.canvasWidth - opts.planeSize.width
    const palneMaxY = opts.canvasHeight - opts.planeSize.height
    const self = this
    opts.canvas.addEventListener('touchstart', (e) => {
      const plane = self.plane
      const oldTouchX = e.touches[0].clientX
      const oldTouchY = e.touches[0].clientY
      const oldPlaneX = plane.x
      const oldPlaneY = plane.y

      e.preventDefault()

      opts.canvas.addEventListener('touchmove', (e) => {
        let newTouchX = e.touches[0].clientX
        let newTouchY = e.touches[0].clientY
        let newPlaneX = oldPlaneX + (newTouchX - oldTouchX)
        let newPlaneY = oldPlaneY + (newTouchY - oldTouchY)
        // 限制战机移动范围
        if (newPlaneX < planeMinX) {
          newPlaneX = planeMinX
        }
        if (newPlaneX > planeMaxX) {
          newPlaneX = planeMaxX
        }
        if (newPlaneY < planeMinY) {
          newPlaneY = planeMinY
        }
        if (newPlaneY > palneMaxY) {
          newPlaneY = palneMaxY
        }

        e.preventDefault()

        // 更新战机位置
        plane.setPos(newPlaneX, newPlaneY)
      }, false)
    }, false)
  }

  updateElement () {
    const plane = this.plane
    const enemies = this.enemies
    let i = enemies.length

    // 判断战机状态
    if (plane.status === 'booming') {
      plane.booming()
    }

    // 循环更新敌机
    while (i--) {
      const enemy = enemies[i]
      enemy.down()

      if (enemy.y >= this.canvasHeight) {
        enemies.splice(i, 1)
      } else {
        // 判断战机状态 撞到敌机就爆炸
        if (plane.status === 'normal' && plane.hasCrash(enemy)) {
          plane.booming()
          //   resourceHelper.playSound('dieSound')
        }
        // 根据敌机状态判断是否被击中
        switch (enemy.status) {
          case 'normal':
            // 判断是否击中未爆炸的敌机
            if (plane.hasHit(enemy)) {
              //   resourceHelper.playSound('boomSound')
              enemy.live--
              // 如果敌机生命为0，则敌机爆炸
              if (enemy.live === 0) {
                enemy.booming()
                // if (navigator.vibrate) {
                //   navigator.vibrate(100)
                // }
              }
            }
            break
          case 'booming':
            enemy.booming()
            break
          case 'boomed':
            let point = enemy.type === 'big' ? 1000 : 100
            enemies.splice(i, 1)
            this.score += point
            break
        }
      }
    }
  }

  draw () {
    // 更新战机
    this.plane.draw()
    // 更新敌机
    this.enemies.forEach(enemy => {
      enemy.draw()
    })
  }
}

const GAME = new Game()
export default GAME

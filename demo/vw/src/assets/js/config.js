/**
 * 游戏配置
 */

const CONFIG = {
  // 小敌机尺寸
  enemySmallSize: {
    width: 54,
    height: 40
  },
  // 大敌机尺寸
  enemyBigSize: {
    width: 130,
    height: 100
  },
  // 默认敌机移动速度
  enemySpeed: 4,
  // 战机尺寸
  planeSize: {
    width: 60,
    height: 45
  },
  // 子弹尺寸
  bulletSize: {
    width: 20,
    height: 20
  },
  // 子弹移动速度
  bulletSpeed: 10,
  resources: {
    images: [
      {
        src: require('@/assets/images/plane_1.png'),
        name: 'bluePlaneIcon'
      },
      {
        src: require('@/assets/images/plane_2.png'),
        name: 'pinkPlaneIcon'
      },
      {
        src: require('@/assets/images/fire.png'),
        name: 'fireIcon'
      },
      {
        src: require('@/assets/images/enemy_big.png'),
        name: 'enemyBigIcon'
      },
      {
        src: require('@/assets/images/enemy_small.png'),
        name: 'enemySmallIcon'
      },
      {
        src: require('@/assets/images/boom_big.png'),
        name: 'enemyBigBoomIcon'
      },
      {
        src: require('@/assets/images/boom_small.png'),
        name: 'enemySmallBoomIcon'
      }
    ],
    sounds: [
      {
        src: require('@/assets/sound/biubiubiu.mp3'),
        name: 'shootSound'
      },
      {
        src: require('@/assets/sound/music.mp3'),
        name: 'gameSound'
      },
      {
        src: require('@/assets/sound/die.mp3'),
        name: 'dieSound'
      },
      {
        src: require('@/assets/sound/button.mp3'),
        name: 'buttonSound'
      },
      {
        src: require('@/assets/sound/boom.mp3'),
        name: 'boomSound'
      }
    ]
  }
}

export default CONFIG

/**
 * 资源管理器
 */
class ResourceHelper {
  constructor () {
    this.enableMusic = true
    this.resources = {
      images: {},
      sounds: {}
    }
  }

  // 加载图片
  imageLoader (src, callback) {
    const image = new Image()
    // 图片加载完成
    image.addEventListener('load', callback)
    image.src = src
    return image
  }

  // 加载声音
  soundLoader (src, callback) {
    const sound = new Audio()
    // 声音加载完成
    sound.addEventListener('canplaythrough', callback)
    sound.src = src
    callback()
    return sound
  }

  preplayAllSound () {
    const self = this
    const sounds = this.resources.sounds

    for (let key in sounds) {
      this.playSound(key, { disable: true })
      setTimeout(() => {
        self.pauseSound(key)
        sounds[key].volume = 1
      }, 50)
    }
  }

  setMusic (enable) {
    this.enableMusic = enable
  }

  /**
           * 资源加载
           */
  load (resources, callback) {
    console.log(resources)
    const self = this
    const images = resources.images
    const sounds = resources.sounds
    const total = images.length + sounds.length
    let finish = 0 // 加载完成个数

    // 遍历加载图片
    for (let i = 0; i < images.length; i++) {
      const name = images[i].name
      const src = images[i].src
      self.resources.images[name] = self.imageLoader(src, () => {
        // 加载完成
        finish++
        if (finish === total) {
          // 全部加载完成
          callback(self.resources)
        }
      })
    }
    // 遍历加载声音
    for (let i = 0; i < sounds.length; i++) {
      const name = sounds[i].name
      const src = sounds[i].src
      self.resources.sounds[name] = self.soundLoader(src, () => {
        // 加载完成
        finish++
        if (finish === total) {
          // 全部加载完成
          callback(self.resources)
        }
      })
    }
  }

  // 播放音乐/音效
  playSound (sound, config) {
    const soundObj = this.resources.sounds[sound]
    if (!soundObj || !this.enableMusic) {
      return
    }
    config = config || {}
    // 是否设置循环
    if (config.loop) {
      soundObj.loop = 'loop'
    }
    // 是否设置音量
    if (config.disabled) {
      soundObj.volume = 0
    } else {
      soundObj.volume = 1
    }

    soundObj.currentTime = 0
    soundObj.play()
    return soundObj
  }

  // 暂停音乐
  pauseSound (sound) {
    const soundObj = this.resources.sounds[sound]
    if (!soundObj || !this.enableMusic) {
      return
    }
    soundObj.pause()
    return soundObj
  }
}

const resourceHelper = new ResourceHelper()

export default resourceHelper

import '../style.css'

import GAME from './game'
import resourceHelper from './resource'

class Controller {
  constructor () {
    this.bg = document.querySelector('.game')
    this.index = document.querySelector('.ui-index')
    this.rule = document.querySelector('.ui-rule')
    this.setting = document.querySelector('.ui-setting')
    this.result = document.querySelector('.ui-result')
    this.score = document.querySelectorAll('.score')

    this.btns = document.querySelectorAll('.btn')
    this.startBtn = document.querySelector('.game-start')
    this.settingBtn = document.querySelector('.game-setting')
    this.settingConfirm = document.querySelector('.game-setting-confirm')
    this.ruleBtn = document.querySelector('.game-rule')
    this.ruleConfirm = document.querySelector('.game-rule-confirm')
    this.resultConfirm = document.querySelector('.game-result-confirm')
  }

  init () {
    // 点击主页按钮
    this.btns.forEach(item => {
      item.addEventListener('click', () => {
        resourceHelper.playSound('buttonSound')
      })
    })
    // 点击开始游戏
    this.startBtn.addEventListener('click', () => {
      this.index.style.display = 'none'
      GAME.start()
    })
    // 点击游戏设置
    this.settingBtn.addEventListener('click', () => {
      this.setting.style.display = 'block'
      this.index.style.display = 'none'
    })
    // 点击游戏说明
    this.ruleBtn.addEventListener('click', () => {
      this.rule.style.display = 'block'
      this.index.style.display = 'none'
    })
    // 点击确认设置
    this.settingConfirm.addEventListener('click', () => {
      // 设置音乐
      const settingMusic = document.querySelector('#setting-music')
      const enable = settingMusic.value === '1'
      resourceHelper.setMusic(enable)

      // 设置背景
      const settingBg = document.querySelector('#setting-bg')
      switch (settingBg.value) {
        case '1':
          this.bg.className = 'game bg1'
          break
        case '2':
          this.bg.className = 'game bg2'
          break
        case '3':
          this.bg.className = 'game bg3'
          break
        case '4':
          this.bg.className = 'game bg4'
          break
      }

      // 设置飞机
      const settingPlane = document.querySelector('#setting-plane')
      GAME.setGameOptions({
        planeType: settingPlane.value
      })

      this.setting.style.display = 'none'
      this.index.style.display = 'block'
    })

    // 点击游戏说明 确认
    this.ruleConfirm.addEventListener('click', () => {
      this.rule.style.display = 'none'
      this.index.style.display = 'block'
    })

    // 点击游戏结束 确认
    this.resultConfirm.addEventListener('click', () => {
      this.result.style.display = 'none'
      this.index.style.display = 'block'
    })
  }

  end () {
    this.index.style.display = 'none'
    this.result.style.display = 'block'
    this.score[0].textContent = `分数：${GAME.score}`
  }

  update () {
    this.score[1].textContent = `分数：${GAME.score}`
  }
}

const controller = new Controller()

GAME.init({
  onInit () {
    resourceHelper.preplayAllSound()
    controller.init()
  },
  onEnd () {
    controller.end()
  },
  onUpdate () {
    controller.update()
  }
})

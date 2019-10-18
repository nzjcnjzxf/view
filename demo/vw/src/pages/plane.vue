<template>
  <div class="container-box">
    <canvas ref="game" :width="W" :height="H"></canvas>
  </div>
</template>

<script>
import GAME from '@/assets/js/game'
export default {
  data () {
    return {
      W: window.innerWidth,
      H: window.innerHeight
    }
  },
  computed: {

  },
  methods: {
    init () {
      const canvas = this.$refs.game
      const context = canvas.getContext('2d')
      // 获取画布宽高
      const canvasWidth = canvas.clientWidth
      const canvasHeight = canvas.clientHeight
      console.log(canvas, context, canvasWidth, canvasHeight, canvas.width, canvas.height)
      GAME.init({
        canvas,
        context,
        canvasWidth,
        canvasHeight,
        onInit () {
          console.log('初始化完成')
          GAME.start()
        },
        onEnd () {
          console.log('游戏结束')
        },
        onUpdate () {
          console.log('更新游戏参数')
        }
      })
    }
  },
  created () {
  },
  mounted () {
    this.init()
  },
  watch: {

  }
}
</script>

<style lang="scss">
.container-box {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: url('../assets/images/bg_1.jpg') no-repeat;
  background-size: cover;
}
</style>

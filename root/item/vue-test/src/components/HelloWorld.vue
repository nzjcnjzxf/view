<template lang="pug">
    div.box
      ul.wrap
        li.item(v-text="msg" v-if="index > 2" v-for="(item,index) in 5" :key="index")
      .sec 分割线
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.box {
  .wrap {
    .item {
      color: red;
    }
  }
}
</style>

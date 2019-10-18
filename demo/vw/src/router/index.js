import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'HelloWorld',
    component: HelloWorld,
    redirect: '/plane'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/components/home')
  },
  {
    path: '/plane',
    name: 'plane',
    component: () => import('@/pages/plane')
  }
  ]
})

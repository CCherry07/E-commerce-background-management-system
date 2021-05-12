import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../views/home/Home.vue'
import Welcome from '@/views/home/children/Welcome.vue'
import Users from '@/views/home/children/userlist/Users.vue'
import AuthorityList from '@/views/authority/AuthorityList.vue'
import Rights from '@/views/authority/Rights'
import Cate from '@/views/goods/Cate'
Vue.use(VueRouter)

const routes = [
  {
    path:'',
    redirect:'/login'
  },
  {
   path:'/login',
   component:Login
  },
  {
    path:'/home',
    component:Home,
    redirect:'/welcome',
    children:[{
      path:'/welcome',
      component:Welcome
    },{
      path:'/users',
      component:Users
    },{
      path:'/rights',
      component:AuthorityList
    },{
      path:'/roles',
      component:Rights
    },
    {
      path:'/categories',
      component:Cate
    }
  ]
  },
 
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach((to,from,next)=>{
  if(to.path === '/login')return next();
  const token= window.sessionStorage.getItem('token')
  if(!token)return next('/login');
  next()
})

export default router

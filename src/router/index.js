import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/loopdata',
    component: Layout,
    redirect: '/loopData/index',
    // meta: { roles: ['admin'] }, // you can set roles in root nav
    children: [
      { path: 'index', component: _import('loopData/index'), name: 'loopdata', meta: { title: 'report', icon: 'chart' }},
      { path: 'report', component: _import('loopData/report'), hidden: true, name: 'report', meta: { title: 'detail', noCache: true }}
    ]
  },
  {
    path: '/manage',
    component: Layout,
    redirect: 'noredirect',
    name: 'manage',
    meta: {
      title: 'backend',
      icon: 'peoples',
      roles: ['admin'] // or you can only set roles in sub nav
    },
    children: [
      { path: 'plant', component: _import('manage/plant'), name: 'plant', meta: { title: 'plant', noCache: true }},
      { path: 'user', component: _import('manage/user'), name: 'user', meta: { title: 'user', noCache: true }},
      { path: 'workshop', component: _import('manage/workshop'), hidden: true, name: 'workshop', meta: { title: 'workshop', noCache: true }},
      { path: 'loop', component: _import('manage/loop'), hidden: true, name: 'loop', meta: { title: 'loop', noCache: true }}
    ]
  },
  {
    path: '/error',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    name: 'errorPages',
    meta: {
      title: 'errorPages',
      icon: '404'
    },
    children: [
      { path: '401', component: _import('errorPage/401'), name: 'page401', meta: { title: 'page401', noCache: true }},
      { path: '404', component: _import('errorPage/404'), name: 'page404', meta: { title: 'page404', noCache: true }}
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

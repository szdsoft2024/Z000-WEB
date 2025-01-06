import { createRouter, createWebHistory } from "vue-router";
//框架引入
import Layout from "szd-client-web/layout/layout";
//路由
export const routes = [
  {
    path: "/login",
    component: () => import("szd-client-web/layout/login/login"),
    hidden: true
  },
  {
    path: "",
    component: Layout,
    redirect: "index",
    name: "Layout",
    hidden: true,
    children: [
      {
        path: "index",
        component: () => import("szd-client-web/layout/home/home.vue"),
        name: "首页",
        meta: {
          title: "首页",
          icon: "dashboard",
          keepAlive: false,
          affix: true
        }
      }
    ]
  },
  {
    path: "/:catchAll(.*)",
    hidden: true,
    component: () => import("szd-client-web/layout/layout/error/404.vue")
  }
];

const baseUrl = window.__POWERED_BY_QIANKUN__ ? "/micro/" : "/";
const router = createRouter({
  base: window.__POWERED_BY_QIANKUN__ ? "/micro/" : "/",
  history: createWebHistory(baseUrl),
  routes
});

export default router;

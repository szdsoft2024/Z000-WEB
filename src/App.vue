<template>
  <el-config-provider>
    <!-- 非路由模式，主应用嵌套微应用 -->
    <template v-if="isInQiankun && !isRouterMicro">
      <div :id="renderId" style="height: 100%" />
    </template>
    <template v-else>
      <router-view />
    </template>
  </el-config-provider>
</template>

<script setup>
  import { computed, getCurrentInstance, onMounted, ref } from "vue";
  import store from "~store";
  import qiankunMicro from "szd-client-web/client/common/qiankun/qiankunMicro";
  import szdRouter from "szd-client-web/client/common/utils/goRouter";
  import szdStoreSession from "szd-client-web/client/common/store/storeSession";
  import szdStoreCookie from "szd-client-web/client/common/store/storeCookie";
  import { lockALLOff } from "szd-client-web/client/common/tools/lock";

  const { appContext } = getCurrentInstance();

  //token值，用于比较是否更换
  const token = ref("");

  //是否乾坤
  const isInQiankun = ref(window.__POWERED_BY_QIANKUN__);
  //动态Id
  const renderId = ref("renderMirco");

  //获取微应用参数
  const props = defineProps({
    szdMircoProps: {
      type: Object,
      default: () => ({})
    }
  });
  //是乾坤，非路由模式，主应用嵌套微应用
  const isRouterMicro = computed(() => {
    if (props.szdMircoProps && props.szdMircoProps.routerCode) {
      return false;
    } else {
      return true;
    }
  });

  //加载数据
  onMounted(() => {
    if (isInQiankun.value) {
      loadQiankunStateChange();
    }
    //是乾坤，非路由模式，主应用嵌套微应用
    if (window.__POWERED_BY_QIANKUN__ && !isRouterMicro.value) {
      renderId.value = "renderMirco" + props.szdMircoProps["routerCode"] + Date.now();
      szdRouter.renderComp({
        context: appContext,
        routerCode: props.szdMircoProps["routerCode"],
        params: props.szdMircoProps["params"] ? props.szdMircoProps["params"] : {},
        renderId: renderId.value
      });
    } else {
      //非iframe增加关闭ie标签，调用解锁
      if (window.self === window.top) {
        szdStoreSession.removeLock(); //sessionStorage通过windows.open打开会把当前数据带入,需要清空session的lock数据
        window.addEventListener("beforeunload", handleBeforeUnload);
      }
      //添加页签激活监听
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }
  });

  //乾坤监听
  const loadQiankunStateChange = () => {
    qiankunMicro.onGlobalStateChange(state => {
      if (state.handle === "clientNavTab") {
        //框架页签变化数据同步微应用VUEX内存
        store.dispatch("frameTag/clientNavTab", state.szdMircoProps);
      }
    }, true);
  };

  //数据解锁
  const handleBeforeUnload = () => {
    lockALLOff();
  };

  //激活浏览器页标签监听
  const handleVisibilityChange = () => {
    if (token.value && token.value !== szdStoreCookie.getToken()) {
      token.value = szdStoreCookie.getToken();
      szdStoreSession.removeCoreLogin();
      setTimeout(() => {
        location.reload(); //重新加载当前页面
      });
    } else {
      token.value = szdStoreCookie.getToken();
    }
  };
</script>

<style lang="scss">
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
</style>
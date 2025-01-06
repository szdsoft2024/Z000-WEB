import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import router from "@/router";
import store from "./store";
import "element-plus/dist/index.css";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
//自定义样式
import "szd-client-web/client/assets/styles/element-ui-appContainer.scss";
import "szd-client-web/client/assets/styles/index.scss";

//前置引用
import installDependency from "szd-client-web/index.js";
//乾坤
import qiankunMicro from "szd-client-web/client/common/qiankun/qiankunMicro";
import "./public-path";

export let app = null;

// 挂载应用
function render(props = {}) {
  const { container } = props;

  if (props["szdMircoProps"]) {
    app = createApp(App, { szdMircoProps: props["szdMircoProps"] });
  } else {
    app = createApp(App);
  }

  installDependency(app);
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }

  app.use(store);
  app.use(router);
  app.use(ElementPlus, {
    locale: zhCn,
    size: "small"
  });
  app.mount(container ? container.querySelector("#app") : "#app");
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

// qiankun的生命周期
export async function bootstrap() {
}

export async function mount(props) {
  qiankunMicro.setActions(props);
  render(props);
}

export async function unmount() {
  app.unmount();
  app = null;
}

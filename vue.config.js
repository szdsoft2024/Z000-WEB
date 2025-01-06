const { defineConfig } = require("@vue/cli-service");

const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const WEB_PORT = process.env.VUE_APP_WEB_PORT || 80;
const JAVA_URL = process.env.VUE_APP_JAVA_URL;
const SYS_CODE = process.env.VUE_APP_SYS_CODE;
const SYS_NAME = process.env.VUE_APP_SYS_NAME;
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
        @import "szd-client-web/client/assets/styles/sidebar-variables.scss"; 
        `
      }
    }
  },
  devServer: {
    // 监听本机中所有IP的端口
    host: "0.0.0.0",
    // 指定端口号
    port: WEB_PORT,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    //单独API后端开发服务器并且希望在同一域上发送API请求时
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: JAVA_URL,
        // 主机头的起源保持默认进行代理时 设置changeOrigin以true覆盖此行为
        changeOrigin: true,
        //重写路径：
        pathRewrite: {
          ["^" + process.env.VUE_APP_BASE_API]: "/"
        }
      }
    }
    // 设置true为该选项时，将绕过主机检查,不建议这样做，因为不检查主机的应用容易受到DNS重新绑定攻击的攻击。
    // disableHostCheck: true
  },
  configureWebpack: config => {
    config.plugins.push(new NodePolyfillPlugin());
    config.output.library = `${SYS_CODE}-[SYS_CODE]`;
    config.output.libraryTarget = "umd";
    config.output.chunkLoadingGlobal = `webpackJsonp_${SYS_CODE}`;
  },
  chainWebpack(config) {
    config.module.rule("svg").exclude.add(resolve("node_modules/szd-client-web/client/assets/icons"));
    config.resolve.alias.set("~store", resolve("./src/store"));
    config.resolve.alias.set("~main", resolve("./src/main.js"));
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("node_modules/szd-client-web/client/assets/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      }).end;
  }
});

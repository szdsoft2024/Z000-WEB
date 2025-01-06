import { createStore } from "vuex";
import storeModules from "szd-client-web/store/index.js";
export default createStore({
  modules: {
    ...storeModules
  }
});

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

import PopUp from "@/components/PopUp.vue";
import Leaderboards from "@/components/Leaderboards.vue";
import Terminal from "@/components/Terminal.vue";
import UserInput from "@/components/UserInput.vue";
import EndScore from "@/components/EndScore.vue";
import ScoreSubmission from "@/components/ScoreSubmission.vue";
import Shape from "@/components/Shape.vue";

Vue.component("PopUp", PopUp);
Vue.component("Leaderboards", Leaderboards);
Vue.component("Terminal", Terminal);
Vue.component("UserInput", UserInput);
Vue.component("EndScore", EndScore);
Vue.component("ScoreSubmission", ScoreSubmission);
Vue.component("Shape", Shape);

new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount("#app");

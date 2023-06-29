import {createStore} from "vuex";
import {auth} from "@/store/modules/auth";
import {play} from "@/store/modules/play";

export default createStore({
    modules: {
        auth, play
    }
})
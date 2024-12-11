// store.js
import { reactive } from 'vue'

export const store = reactive({
    state_user:null,
    chat_msg:'',
    notification_rec:[],
    group_msg:'',
    vidcall_upd:null,
    peer:new Peer()
})
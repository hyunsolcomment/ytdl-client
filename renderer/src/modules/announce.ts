import { announceSlice } from "../store/announce"
import { store } from "../store/store"

export class Announce {
    static show(message: string) {

        store.dispatch(announceSlice.actions.announce(message));
        store.dispatch(announceSlice.actions.setVisible(true));
        
        setTimeout(() => {
            store.dispatch(announceSlice.actions.setVisible(false));
        }, Math.max(message.length*50,1500))
    }
}
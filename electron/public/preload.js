"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electron', {
    send(ev, args) {
        electron_1.ipcRenderer.send(ev, args);
    },
    receive(ev, listener) {
        electron_1.ipcRenderer.on(ev, listener);
    },
    invoke(ev, args) {
        return electron_1.ipcRenderer.invoke(ev, args);
    }
});

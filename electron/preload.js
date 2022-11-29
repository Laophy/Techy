const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("api", {
  send: (stringData) => ipcRenderer.send("script", stringData),
  showMessage: () => ipcRenderer.send("showMessage"),
  sendData: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  on: (channel, data) => ipcRenderer.on(channel, data),
  off: (channel, callback) => ipcRenderer.removeListener(channel, callback),
});

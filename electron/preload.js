const { ipcRenderer, contextBridge } = require("electron");
contextBridge.exposeInMainWorld("api", {
  send: (stringData) => ipcRenderer.send("script", stringData),
  loadScript: () => ipcRenderer.send("loadscript"),
  showMessage: () => ipcRenderer.send("showMessage"),
});

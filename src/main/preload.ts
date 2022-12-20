import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    getResponse() {
      const response = ipcRenderer.invoke('dialog:openFile');
      return response;
    },
    selectFolder() {
      const imagePath = ipcRenderer.invoke('dialog:openFile');
      return imagePath;
    },
    selectUnoriented() {
      const imagePath = ipcRenderer.invoke('select:Unoriented');
      return imagePath;
    },
    selectUndefined() {
      const imagePath = ipcRenderer.invoke('select:Undefined');
      return imagePath;
    },
    selectOriented() {
      const imagePath = ipcRenderer.invoke('select:Oriented');
      return imagePath;
    },
    selectSave() {
      ipcRenderer.invoke('select:Save');
    },
    selectPrevious() {
      const imagePath = ipcRenderer.invoke('select:Previous');
      return imagePath;
    },
    selectNext() {
      const imagePath = ipcRenderer.invoke('select:Next');
      return imagePath;
    },
    getAssetsPath() {
      const assetsPath = ipcRenderer.invoke('get:assetsPath');
      return assetsPath;
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
});

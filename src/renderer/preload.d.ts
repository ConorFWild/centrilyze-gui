import { Channels } from 'main/preload';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        on(
          channel: Channels,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: Channels, func: (...args: unknown[]) => void): void;
        selectUndefined(): Promise<any>;
        selectUnoriented(): Promise<any>;
        selectOriented(): Promise<any>;
        selectFolder(): Promise<any>;
        selectSave(): Promise<any>;
        selectPrevious(): Promise<any>;
        selectNext(): Promise<any>;
        getAssetsPath(): Promise<any>;
      };
    };
  }
}

export {};

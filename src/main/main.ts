/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog, protocol } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

const fs = require('fs');

let inputJSONPath = null;
const outputJSONPath = null;
let initialAnnotations = null;
const annotations = {};
let currentAnnotationPath = null;
let keys = null;
let currentAnnotationIndex = null;

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  // // Handle Key presses
  // mainWindow.webContents.on('before-input-event', (event, input) => {
  //   if (input.control && input.key.toLowerCase() === 'i') {
  //     console.log('Pressed Control+I');
  //     event.preventDefault();
  //   }
  // });

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  ipcMain.handle(
    'dialog:openFile',
    async () => {
      const options = {
        properties: ['openFile'],
      };

      const { canceled, filePaths } = await dialog.showOpenDialog(
        mainWindow,
        options
      );
      if (canceled) {
        return;
      }

      inputJSONPath = filePaths[0];
      const initialAnnotationsString = fs.readFileSync(filePaths[0]);
      initialAnnotations = JSON.parse(initialAnnotationsString);
      keys = Object.keys(initialAnnotations);
      currentAnnotationIndex = 0;
      // currentAnnotationPath = initialAnnotations[keys[currentAnnotationIndex]];
      for (
        currentAnnotationIndex = 0;
        currentAnnotationIndex < keys.length;
        currentAnnotationIndex++
      ) {
        currentAnnotationPath = keys[currentAnnotationIndex];
        const annotation = initialAnnotations[currentAnnotationPath];
        if (annotation === -1) {
          // console.log(initialAnnotations);
          // console.log(currentAnnotationPath);
          return currentAnnotationPath;
        }
      }

      // currentAnnotationPath = keys[currentAnnotationIndex];

      // console.log(initialAnnotations);
      // console.log(currentAnnotationPath);
      return currentAnnotationPath;
    }
    // handleFileOpen
  );

  ipcMain.handle('select:Unoriented', async () => {
    initialAnnotations[keys[currentAnnotationIndex]] = 0;
    if (currentAnnotationIndex == keys.length - 1) {
      console.log('Done!');
      return path.join(RESOURCES_PATH, 'done.png');
    }
    currentAnnotationIndex += 1;
    currentAnnotationPath = keys[currentAnnotationIndex];
    // console.log(initialAnnotations);
    // console.log(currentAnnotationPath);
    return currentAnnotationPath;
  });
  ipcMain.handle('select:Undefined', async () => {
    initialAnnotations[keys[currentAnnotationIndex]] = 1;
    if (currentAnnotationIndex == keys.length - 1) {
      console.log('Done!');
      return path.join(RESOURCES_PATH, 'done.png');
    }
    currentAnnotationIndex += 1;
    currentAnnotationPath = keys[currentAnnotationIndex];
    // console.log(initialAnnotations);
    // console.log(currentAnnotationPath);
    return currentAnnotationPath;
  });

  ipcMain.handle('select:Oriented', async () => {
    initialAnnotations[keys[currentAnnotationIndex]] = 2;
    if (currentAnnotationIndex == keys.length - 1) {
      console.log('Done!');
      return path.join(RESOURCES_PATH, 'done.png');
    }
    currentAnnotationIndex += 1;
    currentAnnotationPath = keys[currentAnnotationIndex];
    // console.log(initialAnnotations);
    // console.log(currentAnnotationPath);
    return currentAnnotationPath;
  });

  ipcMain.handle('select:Save', async () => {
    console.log('Saving file...');
    // console.log(initialAnnotations);
    // console.log(JSON.stringify(initialAnnotations));

    const outputPath = path.join(
      path.dirname(inputJSONPath),
      'samples_annotated.json'
    );

    fs.writeFile(
      outputPath,
      JSON.stringify(initialAnnotations),
      function (err) {
        if (err) {
          console.log(err);
        }
      }
    );

    console.log(`Saved file to ${outputPath}`);
  });

  ipcMain.handle('select:Previous', async () => {
    if (currentAnnotationIndex == 0) {
      return currentAnnotationPath;
    }
    currentAnnotationIndex -= 1;
    currentAnnotationPath = keys[currentAnnotationIndex];
    return currentAnnotationPath;
  });

  ipcMain.handle('select:Next', async () => {
    if (currentAnnotationIndex == keys.length - 1) {
      return currentAnnotationPath;
    }
    currentAnnotationIndex += 1;
    currentAnnotationPath = keys[currentAnnotationIndex];
    return currentAnnotationPath;
  });

  ipcMain.handle('get:assetsPath', async () => {
    return getAssetPath('selectAJSON.png');
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

// async function handleFileOpen() {
//   const { canceled, filePaths } = await dialog.showOpenDialog()
//   if (canceled) {
//     return;
//   } else {
//     return filePaths[0];
//   }}

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    protocol.interceptFileProtocol(
      'app',
      function (req, callback) {
        const url = req.url.substr(6);
        // const url = req.url;
        // callback({path: path.normalize(__dirname + url)})
        // const urlToLoad = path.join(__dirname, url);
        const urlToLoad = url;

        console.log(urlToLoad);
        callback({ path: urlToLoad });
      },
      function (error) {
        if (error) console.error('Failed to register protocol');
      }
    );
    // ipcMain.handle('dialog:openFile', handleFileOpen);

    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

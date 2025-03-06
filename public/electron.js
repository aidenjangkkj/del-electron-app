// main.js
const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: true,
    },
  });
  
  mainWindow.loadURL(`https://food-desktop.web.app/`);
  mainWindow.show();

  // mainWindow 이벤트 리스너는 mainWindow 생성 후에 설정
  mainWindow.on('closed', () => {
    console.log('BrowserWindow가 닫혔습니다.');
    mainWindow = null;  // 메모리 해제를 위해 null 할당 (옵션)
  });
  
  // 또는, 아래와 같이 index.html 파일을 로드하고 DevTools를 여는 것도 가능
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

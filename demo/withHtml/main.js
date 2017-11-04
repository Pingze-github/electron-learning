
const {app, BrowserWindow} = require('electron');

const path = require('path');

let window;

app.on('ready', function() {
  window = new BrowserWindow({width: 800, height: 600});
  window.loadURL(path.join(__dirname, 'index.html'));
  window.openDevTools(); // 开启开发者工具
});
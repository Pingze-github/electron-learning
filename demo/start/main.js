
const {app, BrowserWindow} = require('electron');

let window;

app.on('ready', function() {
  window = new BrowserWindow({width: 800, height: 600});
  window.loadURL('http://www.duoyi.com/');
});

const {app, BrowserWindow, dialog} = require('electron');

let window;

app.on('ready', function() {
  window = new BrowserWindow({width: 800, height: 600});
  window.loadURL('http://electron.org.cn');
  //dialogActions();
  setTimeout(() => {
    dialogActions(); // 对话框会阻塞window的渲染
  },500);
});

async function dialogActions() {
  dialog.showMessageBox({
    type: 'info',
    buttons: ['确定', '取消'],
    title: '消息对话框',
    message: '这确实是一个消息对话框吗？'
  }, (res) => {
    console.log(res);
  });
  dialog.showErrorBox('错误对话框', '这是一个错误对话框');
}
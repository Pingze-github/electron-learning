# electron-learning
Electron学习笔记

## 快速开始

### 如何执行

```node_modules/electron/dist/electron [project folder]```
> 为了方便，全局安装electron
> ```npm i -g electron```

### 打包
通常打包为二进制的asar格式。<br>
```npm i -g asar```  <br>
```asar pack [project folder] [asar file]``` <br>
执行:
```electron [asar file]```

### 项目结构

app/ <br>
| -- package.json : 应用声明<br>
| -- main.js : 主进程脚本 <br>
| -- renderer.js : 渲染进程脚本 <br>

> package.json

```
{
  "name"    : "your-app",
  "version" : "0.1.0",
  "main"    : "main.js"
}
```

> main.js

```
const {app, BrowserWindow} = require('electron');
let window;
app.on('ready', function() {
  window = new BrowserWindow({width: 800, height: 600});
  window.loadURL('http://www.duoyi.com/');
});
```

> renderer.js 可以为空

### 核心概念

#### 主进程/渲染进程
分别对应`main.js`和`renderer.js`。 <br>
主进程以创建Web页面的形式展示窗口。<br>
渲染进程调用chromium展示页面。<br>
Electron与一般Webview的最大区别在于，允许页面（渲染进程）调用系统底层API。

#### 进程间通信
Electron将窗口主进程和页面渲染进程隔离，但两者也可以通信。一般通过ipc。

> main.js

```
const ipc = require('electron').ipc;
ipc.on('online-status-changed', function(event, status) {
  console.log(status);
});
```

> index.html

```
ipc.send('online-status-changed', navigator.online);
// navigator.online HTML5标准API，返回当前环境是否有网络连接
```

#### 环境变量
控制Electron的一些行为。比Chrome命令行开关执行更早。

#### Chrome 命令行开关
在`app.ready`事件前执行，进行chromium浏览器的功能开关。
```
app.commandLine.appendSwitch('host-rules', 'MAP * 127.0.0.1'); // 控制主机名映射
```

#### 桌面环境集成
Electron提供了一些API来使APP可以使用各个OS中应用的功能（最近文件、略缩图等）

#### process 对象
>
**process.type** *String* - 进程类型, 可以是 browser (i.e. main process)或 renderer.
<br>**process.versions['electron']** *String* - Electron的版本.
<br>**process.versions['chrome']** *String* - Chromium的版本.
<br>**process.resourcesPath** *String* - JavaScript源代码路径.
<br>**process.mas** *Boolean* - 在Mac App Store 创建, 它的值为 true, 在其它的地方值为 undefined.

```
process.once('loaded', () => {
    // 在Electron已经加载了其内部预置脚本和它准备加载主进程或渲染进程的时候触发.
})
process.hang(); //挂起当前进程的主线程
```

## API

### HTML5 API

##### Electron DOM File
> 为了让用户能够通过HTML5的file API直接操作本地文件，DOM的File接口提供了对本地文件的抽象。Electron在File接口中增加了一个path属性，它是文件在系统中的真实路径。

##### Electron DOM <webview>
>

##### Electron window.open
>当在界面中使用 window.open 来创建一个新的窗口时候，将会创建一个 BrowserWindow 的实例，并且将返回一个标识，这个界面通过标识来对这个新的窗口进行有限的控制.
 这个标识对传统的web界面来说，通过它能对子窗口进行有限的功能性兼容控制.<br>
 想要完全的控制这个窗口，可以直接创建一个 BrowserWindow .
 新创建的 BrowserWindow 默认为继承父窗口的属性参数，想重写属性的话可以在 features 中设置他们.

---

### 主进程可用模块

##### app
>app 模块是为了控制整个应用的生命周期设计的。

##### autoUpdater
>这个模块提供了一个到 Squirrel 自动更新框架的接口。

##### BrowserWindow
> BrowserWindow 类让你有创建一个浏览器窗口的权力。
此类对象可以控制对应窗口的状态。

##### dialog
> dialog 模块提供了api来展示原生的系统对话框，例如打开文件框，alert框，所以web应用可以给用户带来跟系统应用相同的体验.

##### global-shortcut
> 注册全局快捷键

##### ipcMain
> ipcMain 模块是类 EventEmitter 的实例.当在主进程中使用它的时候，它控制着由渲染进程(web page)发送过来的异步或同步消息.从渲染进程发送过来的消息将触发事件.

在main.js中为ipcMain，在renderer.js中为ipcRenderer。

有同步异步两种方法:

>main.js

```
const ipcMain = require('electron').ipcMain;
ipcMain.on('异步', function(event, arg) {
  console.log(arg);  // prints "ping"
  event.sender.send('asynchronous-reply', 'pong');
});

ipcMain.on('同步', function(event, arg) {
  console.log(arg);  // prints "ping"
  event.returnValue = 'pong';
});
```
>renderer.js

```
const ipcRenderer = require('electron').ipcRenderer;

console.log(ipcRenderer.sendSync('同步', 'ping')); // prints "pong"

ipcRenderer.on('异步', function(event, arg) {
  console.log(arg); // prints "pong"
});
ipcRenderer.send('异步', 'ping');
```

##### menu
> 用于创建窗口菜单

##### MenuItem
> 用于创建窗口菜单项

##### session
> 用于创建修改会话。可以操作页面cookie

##### webContents
> 用于发出事件

##### Tray
> 用于创建系统托盘相关

##### protocol
> 用于创建一个特别的协议，供其他应用调用以影响APP。

---

### 渲染进程可用模块

##### desktopCapturer
> 用来获取可用资源

##### ipcRenderer
> 用于通信

##### remote
> 提供了一种在渲染进程（网页）和主进程之间进行进程间通讯（IPC）的简便途径。<br>
使用 remote 模块，可以调用主进程对象的方法，而无需显式地发送进程间消息

```
// in renderer.js
const remote = require('electron').remote;
const BrowserWindow = remote.BrowserWindow;

var win = new BrowserWindow({ width: 800, height: 600 });
win.loadURL('https://github.com');
```

> 注意: 反向操作（从主进程访问渲染进程），可以使用webContents.executeJavascript.<br>
remote实际是内部调用ipc，在主进程中创建对象。

##### webFrame
> 控制如何渲染页面。可以控制缩放等。

---

### 通用模块

##### clipboard
> 模块提供方法来供复制和粘贴操作

##### crashReporter
> 发送应用崩溃报告

##### nativeImage
> 创建和操纵图片对象

##### screen
> 用于检索屏幕的 size，显示，鼠标位置等的信息

##### shell
> shell 模块提供了集成其他桌面客户端的关联功能.
打开目录、文件、外部协议，发出beep等。


---

## Demo

最小例子：start

内置html： withHtml

文件拖拽: fileDrag

对话窗口: dialog
默认是没有使用electron的，如果要使用electron应该将下面内容追加到package.json中。

```json
{
	"main": "electron/background.js",
	"scripts": {
		"electron:build": "vite build && electron-builder build",
    		"electron:build:win32": "vite build && electron-builder --win --ia32"
	},
	"dependencies":{
		"electron-devtools-installer": "^3.2.0",
    		"electron-store": "^8.1.0"
	}
	"devDependencies":{
		"electron": "^28.2.1",
		"electron-builder": "^24.9.1",
		"electron-win-state": "^1.1.22"
	}
}   


```

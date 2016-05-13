### mobile-upload-demo

移动端 Web 传图示例

![](https://cloud.githubusercontent.com/assets/4652816/15246896/e9124292-1942-11e6-8456-c3c23d065159.png)

#### 详细说明

https://github.com/progrape/mobile-upload-demo/issues/1

#### 运行

```
git clone https://github.com/progrape/mobile-upload-demo.git
cd mobile-upload-demo
npm install
npm start
```

服务端接收程序是 `koa` 写的, 确保你的 `node` 版本可以运行 `koa`

浏览器打开 `http://localhost:3000`, 选择图片, 点击上传, 图片会保存到 `public/upload` 目录.

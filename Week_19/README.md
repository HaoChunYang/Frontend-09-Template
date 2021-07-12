学习笔记

发布服务，是由一个发布的服务器端和一个发布工具。来构成的。

## 发布工具：
  publish-serve: 负责向真实的 server 去 copy 文件

```js
// 最简单的创建服务
let http = require('http')

http.createServer((req, res) => {
  console.log('req:', req)
  res.end('Hello world')
}).listen(8082)
```
## 发布服务器：
  publish-tool: 

  流式处理。利用流式处理，体积不一定小。利用此特性，让服务器的效率达到最高。
```js
// 发送请求
let req = http.request({
  hostname: '127.0.0.1',
  port: 8082
}, response => {
  console.log(response)
})

req.end()
```

### 流

```js
// 创建一个文件的流
let file = fs.createReadStream('./package.json')
// 监听 data 事件
file.on('data', chunk => {
  console.log(chunk.toString())
})
// 监听 end 事件
file.on('end', chunk => {
  console.log('read finished')
})
```

`npm start&` 不会再阻塞console

## 遇到一个问题。

文件经过 publish-server 服务器发布到 server 上以后，调用一个 publish-server 服务器 http://localhost:8082 浏览器中返回success信息。此时，server上面，刚才成功部署的文件，会变为空文件。

```js
  req.on('end', () => {
    res.end('success!')
  })
  // 这一段代码生效，并在浏览器中调用时，就会出现上面的问题。
```

## API

读取文件大小 `fs.stat(path, callback)`

8节，9分多钟好像有鸟叫。哈哈

## 注意

archive.directory('./sample/', false) // 注意这里后面加要一个 / 
let http = require('http')

let fs = require('fs')

// // 创建一个文件的流
// let file = fs.createReadStream('./package.json')
// // 监听 data 事件
// file.on('data', chunk => {
//   console.log(chunk.toString())
// })
// // 监听 end 事件
// file.on('end', chunk => {
//   console.log('read finished')
// })

// write 是一个异步的 API  
// drain 事件。调用 end 的时候，不一定都写完了。只是你通知说我写完了。

let req = http.request({
  hostname: '182.92.176.122',
  port: 8082,
  method: 'POST', // 要发送流式数据，需要 POST 请求
  headers: {
    'Content-Type': 'application/octet-stream' // 常见的流式传输的协议
  }
}, response => {
  // console.log(response)
})

// 创建一个文件的流
let file = fs.createReadStream('./sample.html')
// 监听 data 事件
file.on('data', chunk => {
  console.log(chunk.toString())
  req.write(chunk)
})
// 监听 end 事件
file.on('end', chunk => {
  console.log('read finished')
  req.end(chunk) // 最后一次发送 chunk 数据
})

// req.end()
let http = require('http')

let fs = require('fs')

const archiver = require('archiver')

// write 是一个异步的 API  
// drain 事件。调用 end 的时候，不一定都写完了。只是你通知说我写完了。

// 压缩文件部分操作代码
// const archive = archiver('zip', {
//   zlib: { level: 9 }
// })
// archive.directory('./sample/', false) // 注意这里后面加要一个 / 
// archive.finalize() // 为压缩包，填好内容

// archive.pipe(fs.createWriteStream('tmp.zip'))

fs.stat('./sample/sample.html', (err, stats) => {

  let req = http.request({
    hostname: '182.92.176.122',
    // hostname: '127.0.0.1',
    port: 8082,
    method: 'POST', // 要发送流式数据，需要 POST 请求
    headers: {
      'Content-Type': 'application/octet-stream', // 常见的流式传输的协议
      // 'Content-Length': stats.size
    }
  }, response => {
    // console.log(response)
  })

  // 创建一个文件的流
  let file = fs.createReadStream('./sample/sample.html')

  const archive = archiver('zip', {
    zlib: { level: 9 }
  })
  archive.directory('./sample/', false) // 注意这里后面加要一个 / 
  archive.finalize() // 为压缩包，填好内容

  // archive.pipe(fs.createWriteStream('tmp.zip'))
  archive.pipe(req)


  // 方法二
  // file.pipe(req)

  // file.on('end', () => {
  //   req.end()
  // })
})
/*
let req = http.request({
  // hostname: '182.92.176.122',
  hostname: '127.0.0.1',
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

file.pipe(req)

file.on('end', () => {
  req.end()
})
*/
/*
// 方法一，直接传送文件
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
*/
// req.end()
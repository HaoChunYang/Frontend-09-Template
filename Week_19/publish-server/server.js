let http = require('http')
let fs = require('fs')

http.createServer((req, res) => {
  // console.log('req:', req)
  console.log(req.headers)

  let outFile = fs.createWriteStream('../server/public/index.html')

  // 服务端的 request 就是一个 readable 的流
  req.on('data', chunk => {
    // console.log(chunk.toString())
    outFile.write(chunk)
  })
  req.on('end', () => {
    // outFile.write(chunk) // 错误写法
    res.end('Success')
    outFile.end()
  })
}).listen(8082)
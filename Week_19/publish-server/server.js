let http = require('http')
let fs = require('fs')
let unzipper = require('unzipper')

http.createServer((req, res) => {
  // console.log('req:', req)
  // console.log(req.headers)
  console.log('request')

  req.pipe(unzipper.Extract({ path: '../server/public/' }))

  /*
  // 方式二，接收压缩文件流到文件
  let outFile = fs.createWriteStream('../server/public/tmp.zip')
  req.pipe(outFile)
  req.on('end', () => {
    res.end('success!')
  })
  */
  /*
    // 方式一
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
    */
}).listen(8082)
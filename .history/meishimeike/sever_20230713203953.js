const express = require('express');
var Cheerio = require('cheerio')
const app = express();

const msmk = express.Router()

msmk.get('/hello.html', (req, res) => {
    res.sendFile(__dirname + "/hello.html")
});


app.use("/meishimeike", msmk)

// 启动服务器
app.listen(8080, () => {
    console.log('Server is running on port 8080');
});


// sendFile 地址写错，给__dirname加了引号
// 一开始用render，更不对，那是模板引擎用的

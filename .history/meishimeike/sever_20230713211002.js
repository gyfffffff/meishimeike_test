const express = require('express');
var Cheerio = require('cheerio')
var mysql = require('../mysql.js');
const app = express();

const msmk = express.Router()

msmk.get('/hello.html', (req, res) => {
    res.sendFile(__dirname + "/hello.html")
});

msmk.get('/search', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' }); //设置res编码为utf-8
    var keyword = " %" + req.query.keyword + "% "
    // sql字符串和参数
    var fetchSql = "select * from dianping_discovery where _text like " + keyword + "_dizhi like" + keyword + "leixing like" + keyword
    mysql.query(fetchSql, function (err, result, fields) {
        console.log(result);
        res.end(JSON.stringify(result));
    });
})

app.use("/meishimeike", msmk)

// 启动服务器
app.listen(5500, () => {
    console.log('Server is running on port 5500');
});


// sendFile 地址写错，给__dirname加了引号
// 一开始用render，更不对，那是模板引擎用的
// 要停止live, 才能使用路由

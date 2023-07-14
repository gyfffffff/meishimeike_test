const express = require('express');
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

app.get('/search', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' }); //设置res编码为utf-8
    //sql字符串和参数
    var fetchSql = "select * from dianping_discovery where _text like %" +key
        req.query.title + "%'";
    mysql.query(fetchSql, function (err, result, fields) {
        console.log(result);
        res.end(JSON.stringify(result));
    });
})
// sendFile 地址写错，给__dirname加了引号
// 一开始用render，更不对，那是模板引擎用的

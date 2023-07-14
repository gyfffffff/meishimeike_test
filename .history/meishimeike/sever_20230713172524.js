const express = require('express');
const app = express();

// 搜索提示路由处理程序
app.get('/hello.html', (req, res) => {
    const query = req.body.query;
    res.render("./hello.html")
});


app.use(msmk, "/meishimeike")

// 启动服务器
app.listen(5500, () => {
    console.log('Server is running on port 5500');
});

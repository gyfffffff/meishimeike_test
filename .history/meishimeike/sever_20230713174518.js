const express = require('express');
const app = express();

const msmk = express.Router()

app.get('/hello.html', (req, res) => {
    res.sendFile(__dirname + " /" + "hello.html")
});


app.use("/meishimeike", msmk)

// 启动服务器
app.listen(8080, () => {
    console.log('Server is running on port 8080');
});

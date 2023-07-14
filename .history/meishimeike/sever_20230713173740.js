const express = require('express');
const app = express();
// app.get("/meishimeik/hello.html", (req, res) =>{
//     res.sendFile("/list")
// })

const msmk = express.Router()

msmk.get('/hello', (req, res) => {
    res.se("./hello.html")

});


app.use("./meishimeike", msmk)

// 启动服务器
app.listen(5500, () => {
    console.log('Server is running on port 5500');
});

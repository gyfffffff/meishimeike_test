// server.js

const express = require('express');
const app = express();
const port = 3000;

// 假设您的搜索建议数据存储在一个数组中
const suggestions = [
    'Apple',
    'Banana',
    'Orange',
    'Mango',
    'Pineapple'
];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 搜索提示路由处理程序
app.post('/search-suggestions', (req, res) => {
    const query = req.body.query;
    const matchedSuggestions = suggestions.filter(suggestion => suggestion.toLowerCase().includes(query.toLowerCase()));
    res.json(matchedSuggestions);
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

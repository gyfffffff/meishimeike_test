const express = require('express');
const app = express();

// 假设您的搜索建议数据存储在一个数组中
const suggestions = [
    'Apple',
    'Banana',
    'Orange',
    'Mango',
    'Pineapple'
];

// 搜索提示路由处理程序
app.post('/search-suggestions', (req, res) => {
    const query = req.body.query;

    // 过滤匹配的搜索建议
    const matchedSuggestions = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(query.toLowerCase())
    );

    res.json(matchedSuggestions);
});

// 启动服务器
app.listen(5500, () => {
    console.log('Server is running on port 3000');
});

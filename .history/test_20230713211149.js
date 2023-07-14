var keyword = "%" + "每" + "%"
// sql字符串和参数
var fetchSql = "select * from dianping_discovery where _text like " + keyword + "dizhi like" + keyword + "leixing like" + keyword
console.log(fetchSql)
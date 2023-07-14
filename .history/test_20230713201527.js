var keyword = " '%" + "美" + "%' "
//sql字符串和参数
var fetchSql = "select * from dianping_discovery where _text like " + keyword + "or _dizhi like" + keyword + "or leixing like" + keyword
console.log(fetchSql)
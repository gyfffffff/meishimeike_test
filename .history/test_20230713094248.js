var str1 = "😄😃😀😊☺😆😋"

// var str ="今天哈哈哈😆真好玩😋！"

// var matches = str.replace()
var str2 = "今天哈哈哈😆真好玩😋！";
var emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\u200D/g;
var result = str2.replace(emojiRegex, '');
console.log(result);

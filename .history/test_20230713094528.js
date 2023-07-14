var str1 = "😄😃😀😊☺😆😋"

// var str ="今天哈哈哈😆真好玩😋！"

// var matches = str.replace()
var str2 = "一家撸宠物的好去处💕这里有雪貂🦡，刺猬🦔，龙猫🐁，蜜袋鼯🦝，小香猪🐷，安哥拉巨兔🐰  。炎炎夏日的武汉，这里真的太适合来玩了!店内有超多兔兔🐰和其他萌宠🐭，不仅可以近距离接触，还可以抱兔叽，这里面的小姐姐也超贴心，会跟你介绍🐭和讲解注意事项。";
var emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\u200D/g;
var result = str2.replace(emojiRegex, '');
console.log(result);

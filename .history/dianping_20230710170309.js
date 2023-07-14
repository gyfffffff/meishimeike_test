// 引入必须模块
var fs = require('fs')   // 页面存储
var Request = require('request')  // 发送请求
var Cheerio = require('cheerio')  // 解析
var Iconv = require('iconv-lite') // utf8格式转化
require('date-utils')  // 日期解析

var Encoding = "utf8"
// var seedURL = 'https://github.com/search?q=ChatGPT&type=repositories'
var seedURL = 'https://www.dianping.com/shanghai/ch10/r1325'

var dianjia_url = "$('#shop-all-list .txt a')"   // 店家简介块中的连接

var headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    'Cookie': 'fspop=test; cy=1; cye=shanghai; s_ViewType=10; _lxsdk_cuid=1893a333fe9c8-03d5e50256d40d-26031d51-e1000-1893a333fe9c8; _lxsdk=1893a333fe9c8-03d5e50256d40d-26031d51-e1000-1893a333fe9c8; _hc.v=c0666d72-45b3-e7a3-cf3e-4cab134fae84.1688898587; qruuid=515d0d83-bc9f-4c41-9d02-dcd12d4a7cf4; WEBDFPID=75yuy4361w105955zx53w1103295yw698106z6646129795885490x9w-2004258590093-1688898583277WAGKQUYfd79fef3d01d5e9aadc18ccd4d0c95071136; dplet=34d83874ac94a30a752042fc3c8246ee; dper=779316afd8d7defe2892e64b894b9d1bcec846b42e657f0f2a50f1fcbbd3ce84a8f72381ea817906deaade06de3edbcac79cdbbd0f1addc3a1a89c368e7bd986; ua=%E8%93%9D%E9%BB%91%E5%86%B0%E9%9B%A8; ctu=be0ff75e5fe65f75a87646e464f342aa9e7ac753dba9b4820aba17f3f9bfdfd4; aburl=1; ll=7fd06e815b796be3df069dec7836c3df',
    // 'Cookie': '',
}

var options = {
    url: seedURL,
    headers: headers,
    // proxy: 'http://127.0.0.1:10809',
    timeout: 5000  // 最多等待5秒
}

Request(options, (err, response, body) => {
    if (!err && response.statusCode == 200) {
        console.log("request success!")  // 本来是utf8, 转码后反而乱码
        // console.log(body)
        parse(body)  // 解析网页
    } else {
        console.log("request failed: " + err)
    }
})

function parse(body) {
    var $ = Cheerio.load(body, { decodeEntities: true })  // 准备用cheerio解析html
    var dianjia
    try {
        dianjia = eval(dianjia_url)
    } catch (e) { console.log('店家简介块定位出错:' + e) }

    dianjia.each(function (index, a) {   // 遍历每个店家
        var href = ""   // 获取店家网址
        try {
            href = $(a).attr("href")
            console.log(href)
        } catch (e) {
            console.log('识别种子页面中的新闻链接出错：' + e)
        }
    })
}
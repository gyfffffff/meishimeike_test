// 引入必须模块
var fs = require('fs')
var Request = require('request')  // 发送请求
var Cheerio = require('cheerio')  // 解析
require('date-utils')  // 日期解析
var schedule = require('node-schedule');  // 定时
var mysql = require('./mysql.js')  // 数据库
var myIconv = require('iconv-lite')

// 定时规则：每天11点执行
// let rule = new schedule.RecurrenceRule();
// rule.hour = 11
// rule.minute = 28
// rule.second = 10

var seedURL = 'https://www.xiaohongshu.com/explore?channel_id=homefeed.food_v3'

var headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    'Cookie': 'xhsTrackerId=87e78dd9-e8fd-4f74-9f9e-2e827b09200d; xhsTrackerId.sig=cAWBjsP7mmUz_btc-V755BhBbUh9bkevtwvgYXCk0_s; xsecappid=xhs-pc-web; a1=1879c73d0afvexs7kkq8m28qhjh6p2o62zfoom5vk50000326882; webId=8e0d6593579c6ec00bb5adfe09eb021a; gid=yYWjSWqSfWJfyYWjSWqf8u620ihdCMWTTAY6ihTJYAxVxl28KUJlKl888qJKYYJ8KDd28iiY; gid.sign=ScBpl9pEz3oFRe2dWDZfy2BqI2A=; web_session=0400698e72fe8b561140c02698364bef3a4bf1; webBuild=2.14.5; websectiga=9730ffafd96f2d09dc024760e253af6ab1feb0002827740b95a255ddf6847fc8; sec_poison_id=bd1cd5ac-dcce-4bfb-9c71-adbf8f23e971',
}


// let job = schedule.scheduleJob(rule, () => {
myRequest(seedURL, "seed")
// });

var count = 0
function myRequest(url, str) {
    count++
    console.log(count)

    let fetch_url_sql = 'select url from dianping_discovery where url=?'
    let fetch_url_sql_param = [url]
    mysql.query(fetch_url_sql, fetch_url_sql_param, (qerr, vals, fields) => {
        if (vals.length > 0) {
            console.log("duplicate!")
            return
        }
    })
    var options = {
        url: url,
        headers: headers,
        // proxy: 'http://127.0.0.1:10809',
        timeout: 10000  // 最多等待10秒
    }
    Request(options, (err, response, body) => {
        if (!err && response.statusCode == 200) {
            // console.log("request success:", url)  // 本来是utf8, 转码后反而乱码
            if (!body.includes("内容加载失败")) {
                if (str == "seed") parseSeed(body)
                else if (str == "class") parseClass(body)
                else if (str == "item") parseItem(body, url)
            } else {
                // console.log("种子页面内容加载失败")
            }
        } else {
            console.log("request failed: " + err, url)
        }
    })
}








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

var Encoding = "utf-8"
var seedURL = 'https://www.dianping.com/discovery/'

var headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    'Cookie': 'fspop=test; cy=1; cye=shanghai; s_ViewType=10; _lxsdk_cuid=1893a333fe9c8-03d5e50256d40d-26031d51-e1000-1893a333fe9c8; _lxsdk=1893a333fe9c8-03d5e50256d40d-26031d51-e1000-1893a333fe9c8; _hc.v=c0666d72-45b3-e7a3-cf3e-4cab134fae84.1688898587; qruuid=515d0d83-bc9f-4c41-9d02-dcd12d4a7cf4; WEBDFPID=75yuy4361w105955zx53w1103295yw698106z6646129795885490x9w-2004258590093-1688898583277WAGKQUYfd79fef3d01d5e9aadc18ccd4d0c95071136; dplet=34d83874ac94a30a752042fc3c8246ee; dper=779316afd8d7defe2892e64b894b9d1bcec846b42e657f0f2a50f1fcbbd3ce84a8f72381ea817906deaade06de3edbcac79cdbbd0f1addc3a1a89c368e7bd986; ua=%E8%93%9D%E9%BB%91%E5%86%B0%E9%9B%A8; ctu=be0ff75e5fe65f75a87646e464f342aa9e7ac753dba9b4820aba17f3f9bfdfd4; aburl=1; ll=7fd06e815b796be3df069dec7836c3df',
    // 'Cookie': '',
}


// let job = schedule.scheduleJob(rule, () => {
    myRequest(seedURL, "seed")
// });

function myRequest(url, str){
    let fetch_url_sql = 'select url from fetches where url=?'
    let fetch_url_sql_param = [url]
    mysql.query(fetch_url_sql, fetch_url_sql_param, (qerr, vals, fields) =>{
        if(vals.length>0){
            return
        }
    })
    var options = {
        url: url,
        headers: headers,
        // proxy: 'http://127.0.0.1:10809',
        timeout: 10000  // 最多等待5秒
    }
    Request(options, (err, response, body) => {
        if (!err && response.statusCode == 200) {
            console.log("request success:", url)  // 本来是utf8, 转码后反而乱码
            if (!body.includes("内容加载失败")){
                // fs.writeFileSync("./htmls/" + url.slice(-2) + ".txt", body)
                // console.log(body)
                // body= myIconv.decode(body, Encoding)
                if(str == "seed") parseSeed(body)
                else if(str == "class") parseClass(body)
                else if(str == "item")  parseItem(body, url)
            }else{
                console.log("种子页面内容加载失败")
            }
        } else {
            console.log("request failed: " + err, url)
        }
    })
}

function parseSeed(body) {
    let $ = Cheerio.load(body, { decodeEntities: true })  // 准备用cheerio解析html
    let all_class;
    try {
        all_class = $(".channel-nav li a")
    } catch (e) { console.log('分类url获取出错:' + e) }

    all_class.each(function (index, elememt) {   // 遍历每个店家
        var href = ""   // 获取分类网站
        let class_name = ""  // 类型名称
        try {
            href = "https:" + $(elememt).attr("href")
            class_name = $(elememt).text()
            if (class_name == "推荐" || class_name == "美食" ||class_name == "生活服务" || class_name=="丽人"){  //
                console.log(href, class_name)
                randomDelayRequest(href, "class");
                for(var p=2; p<50; p++){
                    randomDelayRequest(href+"/p"+p, "class");
                }
            }

        } catch (e) {
            console.log('识别种子页面中的分类链接出错：' + e)
        }
    })
}

function parseClass(body){
    var reg = /"contentId":(\d+)/g
    var matches = body.match(reg)
    var href = ""
    for(var i=1; i<matches.length; i++){
        href = "https://www.dianping.com/discovery/" + matches[i].match(/\d+/)[0]
        randomDelayRequest(href, "item");
    }
}

function parseItem(body, url){
    let $ = Cheerio.load(body, { decodeEntities: true })
    var url_shop = ""
    var shop_name = ""
    var score = 0
    var leixing = ""
    var renjun = ""
    var dizhi = "地址"
    var pics = new Array()
    var _text = ""
    var _time = new Date()
    var fensi = 2
    var crawltime = new Date().toFormat("YYYY-MM-DD HH24:MI:SS")


    var fetchAddSql = "INSERT INTO dianping_discovery(_url,url_shop,shop_name,score,leixing,renjun,dizhi,pics,_text,_time,fensi,crawltime) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)";  // 13个字段,13?
    var fetchAddSql_Params = new Array()
    try{
        url_shop = "https:"+$(".related-shop-item a").attr("href")
        shop_name = $(".shop-name").text()
        score = body.match(/sml-str(\d{1,2})/)[1]/10
        leixing = $(".area-info").text().split("|")[0].trim()
        dizhi = $(".area-info").text().split("|")[1].trim()
        renjun = $(".avg-info").text()
        _text = ($(".content-module h1").text() + " " + $(".content-module p").text()).replace(🏠)
        $(".thumbnail-list img").each((index, elememt) => {
            pics.push($(elememt).attr("src"))
        })
        _time = body.match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/)[0]
        fensi = body.match(/粉丝<\/span><span class="value">(\d+)/)[1]-0
        fetchAddSql_Params = [url, url_shop, shop_name, score, leixing, renjun, dizhi, pics.join("; "), _text,  _time, fensi, crawltime]
        // console.log(fetchAddSql_Params)
        mysql.query(fetchAddSql, fetchAddSql_Params, (qerr, vals, fields) => {
            if(qerr){console.log(qerr)}
        })
    } catch(e) {console.log(url+" 解析出错：" +e +score, dizhi, fensi)}
}

// function getComments(url){
//     return {4.5 : "henbang!", 2 : "不好吃。", 3 : "一般啊。"}
// }

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function randomDelayRequest(url, str) {
    var minDelay = 5000; // 最小停顿时间，单位：毫秒
    var maxDelay = 80000; // 最大停顿时间，单位：毫秒

    var delaysec = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    await delay(delaysec);

    myRequest(url, str)
    console.log("Delayed："+ delaysec/1000 + "秒");
}


// 引入必须模块
var fs = require('fs')
var Request = require('request')  // 发送请求
var Cheerio = require('cheerio')  // 解析
require('date-utils')  // 日期解析

var Encoding = "utf8"
var seedURL = 'https://www.dianping.com/discovery/a/50'

var headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    'Cookie': 'fspop=test; cy=1; cye=shanghai; s_ViewType=10; _lxsdk_cuid=1893a333fe9c8-03d5e50256d40d-26031d51-e1000-1893a333fe9c8; _lxsdk=1893a333fe9c8-03d5e50256d40d-26031d51-e1000-1893a333fe9c8; _hc.v=c0666d72-45b3-e7a3-cf3e-4cab134fae84.1688898587; qruuid=515d0d83-bc9f-4c41-9d02-dcd12d4a7cf4; WEBDFPID=75yuy4361w105955zx53w1103295yw698106z6646129795885490x9w-2004258590093-1688898583277WAGKQUYfd79fef3d01d5e9aadc18ccd4d0c95071136; dplet=34d83874ac94a30a752042fc3c8246ee; dper=779316afd8d7defe2892e64b894b9d1bcec846b42e657f0f2a50f1fcbbd3ce84a8f72381ea817906deaade06de3edbcac79cdbbd0f1addc3a1a89c368e7bd986; ua=%E8%93%9D%E9%BB%91%E5%86%B0%E9%9B%A8; ctu=be0ff75e5fe65f75a87646e464f342aa9e7ac753dba9b4820aba17f3f9bfdfd4; aburl=1; ll=7fd06e815b796be3df069dec7836c3df',
    // 'Cookie': '',
}

myRequest(seedURL, "seed")
function myRequest(url, str){
    var options = {
        url: url,
        headers: headers,
        // proxy: 'http://127.0.0.1:10809',
        timeout: 5000  // 最多等待5秒
    }
    Request(options, (err, response, body) => {
        if (!err && response.statusCode == 200) {
            console.log("request success:", url)  // 本来是utf8, 转码后反而乱码
            if (!body.includes("内容加载失败")){
                // fs.writeFileSync("./htmls/" + url.slice(-2) + ".txt", body)
                // console.log(body)
                if(str == "seed") parseSeed(body)
                else if(str == "class") parseClass(body)
                else if(str == "item")  parseItem(body, url)
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
            console.log(href, class_name)
            randomDelayRequest(href, "class");
            for(var p=1; p<30; p++){
                randomDelayRequest(href+"p"+p, "class");
            }
        } catch (e) {
            console.log('识别种子页面中的分类链接出错：' + e)
        }
    })
}

function parseClass(body){
    let $ = Cheerio.load(body, { decodeEntities: true })
    try {
        all_item = $(".seed-waterfall-item a")
    } catch (e) { console.log('店家简介块定位出错:' + e) }

    all_shop.each(function(index, elememt){
        var href = ""
        try{
            href = $(elememt).attr("href")
            randomDelayRequest(url, "item");
        }catch(e){
            console.log("店家链接获取错误："+e)
        }

    })
}

function parseItem(body, url){
    let $ = Cheerio.load(body, { decodeEntities: true })
    var shop_name = ""
    var score = ""
    var leixing = ""
    var renjun = ""
    var dizhi = ""
    var qu = ""
    var dianhua  = ""
    var yingyeshijian = ""
    var kouwei = ""
    var huanjing = ""
    var fuwu = ""
    var tuijiancai = {}  // name : price
    var user_comments = {}  // score : text
    var pics = new Array()  // 32 img url, from comments

    var fetchAddSql = "INSERT INTO dianping(shop_name, score, leixing, renjun, dizhi, qu, dianhua, yingyeshijian, kouwei, huanjing, fuwu, tuijiancai, user_comments, pics) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)"
    var fetchAddSql_Params = new Array()
    try{
        shop_name = $(".shop-name").text()
        score = $(".star-wrapper div").eq(1).tagname.s
        leixing = $(".breadcrumb a").eq(1).text()
        qu = $(".breadcrumb a").eq(2).text()
        renjun = $("#avgPriceTitle").text()
        let regex = /(口味|服务|环境)：(\d+(\.\d+)?)/;
        kouwei = $("#comment_score .item:first").text().match(regex)[1]
        huanjing = $("#comment_score .item").eq(1).text().match(regex)[1]
        fuwu = $("#comment_score .item").eq(2).text().match(regex)[1]
        // dizhi = $("#address").text()
        // dianhua = $(".expand-info tel").text()
        // yingyeshijian = $(".J-other span.item").eq(1).text()
        // let N_tuijiancai = $("ul.recommend-photo li")
        // N_tuijiancai.each((index, elememt) => {
        //     var cai = $(elememt).find("p").text()
        //     var price = $(elememt).find("span").text()
        //     tuijiancai[cai] = price
        // })
        // user_comments = getComments(url)
        // $(".photos").each((index, elememt) => {
        //     $(elememt).find(a).each((aindex, aelement) => {
        //         pics.push($(aelement).attr("href"))
        //     })
        //     if(pics.length > 32){
        //         return false;
        //     }
        // })
        fetchAddSql_Params = [shop_name, score, leixing, renjun, dizhi, qu, dianhua, yingyeshijian, kouwei, huanjing, fuwu, JSON.stringify(tuijiancai), JSON.stringify(user_comments), JSON.stringify(pics)]
        console.log(fetchAddSql_Params)
    } catch(e) {console.log(url+" 解析出错：" +e)}
}

function getComments(url){
    return {4.5 : "henbang!", 2 : "不好吃。", 3 : "一般啊。"}
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function randomDelayRequest(url, str) {
    var minDelay = 500; // 最小停顿时间，单位：毫秒
    var maxDelay = 5000; // 最大停顿时间，单位：毫秒

    var delaysec = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    await delay(delaysec);

    myRequest(url, str)
    console.log("Delayed code executed!");
}


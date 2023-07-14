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
    'Cookie': 'fspop=test; cy=1; cye=shanghai; s_ViewType=10; _lxsdk_cuid=1893a333fe9c8-03d5e50256d40d-26031d51-e1000-1893a333fe9c8; _lxsdk=1893a333fe9c8-03d5e50256d40d-26031d51-e1000-1893a333fe9c8; _hc.v=c0666d72-45b3-e7a3-cf3e-4cab134fae84.1688898587; qruuid=515d0d83-bc9f-4c41-9d02-dcd12d4a7cf4; WEBDFPID=75yuy4361w105955zx53w1103295yw698106z6646129795885490x9w-2004258590093-1688898583277WAGKQUYfd79fef3d01d5e9aadc18ccd4d0c95071136; dplet=34d83874ac94a30a752042fc3c8246ee; dper=779316afd8d7defe2892e64b894b9d1bcec846b42e657f0f2a50f1fcbbd3ce84a8f72381ea817906deaade06de3edbcac79cdbbd0f1addc3a1a89c368e7bd986; ua=%E8%93%9D%E9%BB%91%E5%86%B0%E9%9B%A8; ctu=be0ff75e5fe65f75a87646e464f342aa9e7ac753dba9b4820aba17f3f9bfdfd4; aburl=1; ll=7fd06e815b796be3df069dec7836c3df',
}









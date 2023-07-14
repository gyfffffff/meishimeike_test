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

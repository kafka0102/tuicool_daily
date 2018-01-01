var apiHost = getApp().globalData.apiHost
var base64 = require('base64.js');

var basePageObject = {
  onPullDownRefresh: function () {
    this.requestData();
  },
  onLoad: function (options) {
    this.initLoad(options);
    this.requestData();
  },
  initLoad: function (options) {
    //
  }
};

function request(url, data, success, error, method,needLoading) {
  if (needLoading) {
    wx.showLoading({
      title: '加载中...',
    });
  }
  wx.request({
    url: url,
    data: data,
    method: method ? method : 'GET',
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': "Basic " + base64.encode("127.0.0.1:tuicool")
    },
    dataType: 'json',
    success: (res) => {
      if (needLoading) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
      success(res);
    },
    fail: (err) => {
      if (needLoading) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
      error(err);
    }
  })
}

function callRequest(url, params, cb, method,needLoading) {
  request(
    url,
    params,
    (res) => {
      console.log(res)
      typeof cb == "function" && cb(res)
    },
    (err) => {
      console.log("error:" + err)  // 网络错误
      var res = {
        data : {
          error : "网络错误"
        }
      }
      typeof cb == "function" && cb(res)
    },
    method,
    needLoading
  );
}

function callGetRequest(url, params, cb, needLoading) {
  callRequest(url, params, cb, 'GET', needLoading);
}


function getDailyNews(id, cb) {
  callGetRequest(apiHost +"/api/daily/"+id+".json", {}, cb,true)
}

function getArticleDetail(id, cb) {
  callGetRequest(apiHost+"/api/articles/"+id+".json", {}, cb,true)
}
function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = (o[k] + '').replace(/^0/, '');
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}

module.exports = {
  getDailyNews, getArticleDetail, formatDate, basePageObject
}

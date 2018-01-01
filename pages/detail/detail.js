//logs.js
const util = require('../../utils/util.js')
var WxParse = require('../../wxParse/wxParse.js');

Page({
  __proto__: util.basePageObject,
  data: {
    id: '',
    article: {},
    isLoading: true,
    isSuccess: false,
    error: ''
  },
  initLoad: function (options) {
    this.setData({
      id: options.id,
    });
  },
  requestData: function () {
    var that = this;
    var id = that.data.id;
    util.getArticleDetail(id, (res) => {
      that.setData({
        isSuccess: res.data.success,
        isLoading: false
      });
      if (res.data.success) {
        var content = "<div>" + res.data.article.content + "</div>";
        WxParse.wxParse('content', 'html', content, that, 5);
        that.setData({
          article: res.data.article
        })
      } else {
        that.setData({
          error: res.data.error
        });
      }
    });
  },
  onShareAppMessage: function () {
    return {
      title: this.data.article.title,
      path: '/pages/detail/detail?id=' + that.data.id,
      imageUrl: '/images/logo_mini_share.jpg',
      success: function (res) {
        // 转发成功
      },
    }
  }
});
